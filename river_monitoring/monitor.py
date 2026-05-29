import os
import argparse
import random
import uuid
from collections import deque
from dataclasses import dataclass
from tempfile import TemporaryDirectory
from glob import glob

import cv2
import numpy as np
import torch


@dataclass
class TrackedPoint:
    """A feature point tracked across successive frames."""

    pos: np.ndarray
    life: int
    size: int
    label: str
    font_scale: float
    text_color: tuple[int, int, int]
    vertical: bool


@dataclass
class FlowTrailParticle:
    """A lightweight particle advected by optical flow with a short history."""

    pos: np.ndarray
    history: deque


def sample_size_bell(min_size: int, max_size: int, width_div: float = 4.0) -> int:
    mean = (min_size + max_size) / 2.0
    sigma = (max_size - min_size) / width_div
    for _ in range(8):
        value = int(np.random.normal(mean, sigma))
        if min_size <= value <= max_size:
            return value
    return int(np.clip(value, min_size, max_size))

# define a heuristic water mask based on HSV color thresholds and spatial location, with morphological cleanup
def detect_water_mask(frame: np.ndarray) -> np.ndarray:
    """Return a binary mask for likely water regions (best-effort heuristic)."""
    h, w = frame.shape[:2]
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    blue_water = cv2.inRange(hsv, (70, 30, 20), (145, 255, 255))
    muddy_water = cv2.inRange(hsv, (5, 20, 20), (35, 220, 230))
    mask = cv2.bitwise_or(blue_water, muddy_water)

    spatial = np.zeros((h, w), dtype=np.uint8)
    spatial[int(h * 0.48):, :] = 255
    mask = cv2.bitwise_and(mask, spatial)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    return mask

# convert SAM 2 mask logits to binary masks (uint8, 0 or 255)
def _mask_from_logits(mask_logits: torch.Tensor) -> np.ndarray:
    mask = (mask_logits > 0.0).cpu().numpy()
    if mask.ndim == 3:
        mask = mask[0]
    return (mask.astype(np.uint8)) * 255

# count boundary points in the water mask using morphological gradient to find edges
def count_boundary_points(water_mask: np.ndarray) -> int:
    """Count boundary pixels in the current water mask."""
    boundary_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    boundary_mask = cv2.morphologyEx(water_mask, cv2.MORPH_GRADIENT, boundary_kernel)
    return int(np.count_nonzero(boundary_mask))

# build per-frame water masks using SAM 2 video propagation, seeded with user prompts on a single frame. Returns None if SAM 2 is unavailable or fails, so the caller can fall back to heuristic masking.
def build_sam2_water_masks(
    video_path: str,
    *,
    point_prompts: list[tuple[int, int]] | None = None,
    label_prompts: list[int] | None = None,
    prompt_frame_idx: int = 0,
    obj_id: int = 1,
    model_cfg: str = "configs/sam2.1/sam2.1_hiera_s.yaml",
    checkpoint_path: str = "checkpoints/sam2.1_hiera_small.pt",
) -> list[np.ndarray] | None:
    """Build per-frame water masks using SAM 2 video propagation.

    Returns a list of binary masks (uint8, 0 or 255), aligned to frame index.
    Returns None when SAM 2 cannot be initialized.
    """
    try:
        from sam2.build_sam import build_sam2_video_predictor
    except ImportError:
        print("SAM 2 is not installed. Falling back to heuristic water masking.")
        return None

    if not os.path.exists(checkpoint_path):
        print(f"SAM 2 checkpoint not found at '{checkpoint_path}'. Falling back to heuristic masking.")
        return None

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Unable to open '{video_path}' for SAM 2 preprocessing.")

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count <= 0:
        cap.release()
        print("Unable to determine frame count for SAM 2. Falling back to heuristic masking.")
        return None

    if point_prompts is None:
        point_prompts = [(500, 450), (600, 480), (300, 420)]
    if label_prompts is None:
        label_prompts = [1 for _ in point_prompts]

    with TemporaryDirectory(prefix="sam2_frames_") as tmp_dir:
        frames_dir = os.path.join(tmp_dir, "frames")
        os.makedirs(frames_dir, exist_ok=True)

        idx = 0
        while cap.isOpened():
            ok, frame = cap.read()
            if not ok:
                break
            frame_file = os.path.join(frames_dir, f"{idx:05d}.jpg")
            cv2.imwrite(frame_file, frame)
            idx += 1
        cap.release()

        if idx == 0:
            print("No frames extracted for SAM 2. Falling back to heuristic masking.")
            return None

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Initializing SAM 2 video predictor on {device}...")
        predictor = build_sam2_video_predictor(model_cfg, checkpoint_path, device=device)
        inference_state = predictor.init_state(video_path=frames_dir)

        points = np.array(point_prompts, dtype=np.float32)
        labels = np.array(label_prompts, dtype=np.int32)

        _, out_obj_ids, out_mask_logits = predictor.add_new_points_or_box(
            inference_state=inference_state,
            frame_idx=prompt_frame_idx,
            obj_id=obj_id,
            points=points,
            labels=labels,
        )

        masks_by_frame: dict[int, np.ndarray] = {}
        for i, out_obj_id in enumerate(out_obj_ids):
            if out_obj_id == obj_id:
                masks_by_frame[prompt_frame_idx] = _mask_from_logits(out_mask_logits[i])
                break

        for out_frame_idx, out_obj_ids, out_mask_logits in predictor.propagate_in_video(inference_state):
            for i, out_obj_id in enumerate(out_obj_ids):
                if out_obj_id == obj_id:
                    masks_by_frame[int(out_frame_idx)] = _mask_from_logits(out_mask_logits[i])
                    break

        if not masks_by_frame:
            print("SAM 2 produced no masks. Falling back to heuristic masking.")
            return None

        ordered_masks: list[np.ndarray] = []
        last_mask = None
        for frame_idx in range(idx):
            mask = masks_by_frame.get(frame_idx)
            if mask is None:
                if last_mask is None:
                    last_mask = next(iter(masks_by_frame.values()))
                mask = last_mask
            ordered_masks.append(mask)
            last_mask = mask

        print(f"SAM 2 generated masks for {len(masks_by_frame)} frames; aligned to {idx} total frames.")
        return ordered_masks

# trackerpoint spawning with a deterministic scoring function that favors points near water boundaries, with visible texture, and strong flow (if available)
def spawn_points(
    gray: np.ndarray,
    water_mask: np.ndarray,
    active: list[TrackedPoint],
    max_spawn: int,
    life_frames: int,
    min_size: int,
    max_size: int,
    flow: np.ndarray | None = None,
) -> None:
    corners = cv2.goodFeaturesToTrack(
        gray,
        maxCorners=300,
        qualityLevel=0.01,
        minDistance=7,
        mask=water_mask,
        blockSize=7,
    )

    if corners is None:
        return

    candidates = corners.reshape(-1, 2)
    h, w = gray.shape

    # Build a thin boundary band from the water mask so points can prefer river edges.
    boundary_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    boundary_mask = cv2.morphologyEx(water_mask, cv2.MORPH_GRADIENT, boundary_kernel)

    grad_x = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
    grad_mag = cv2.magnitude(grad_x, grad_y)
    grad_max = float(np.max(grad_mag)) if grad_mag.size else 0.0

    scored_candidates: list[tuple[float, float, float, float]] = []
    for x, y in candidates:
        xi = int(np.clip(x, 0, w - 1))
        yi = int(np.clip(y, 0, h - 1))

        if water_mask[yi, xi] == 0:
            continue

        flow_strength = 0.0
        if flow is not None:
            fx, fy = flow[yi, xi]
            flow_strength = float(np.hypot(fx, fy))

        boundary_score = 1.0 if boundary_mask[yi, xi] > 0 else 0.0
        texture_score = float(grad_mag[yi, xi] / (grad_max + 1e-6)) if grad_max > 0 else 0.0

        # Deterministic score: favor moving points near water boundaries with visible texture.
        score = (1.8 * flow_strength) + (1.2 * boundary_score) + (0.6 * texture_score)
        scored_candidates.append((score, float(x), float(y), flow_strength))

    if not scored_candidates:
        return

    scored_candidates.sort(key=lambda item: (-item[0], item[2], item[1]))

    spawn_target = min(max_spawn, len(scored_candidates))
    spawned = 0
    for score, x, y, flow_strength in scored_candidates:
        if spawned >= spawn_target:
            break

        pos = np.array((x, y), dtype=np.float32)
        if any(np.linalg.norm(tp.pos - pos) < 10 for tp in active):
            continue

        # Scale box size from confidence score without random jitter.
        size_ratio = np.clip(score / 4.0, 0.0, 1.0)
        size = int(min_size + (max_size - min_size) * size_ratio)
        label = f"BOUNDARY-{int(flow_strength * 100):02d}"

        active.append(
            TrackedPoint(
                pos=pos,
                life=life_frames,
                size=int(np.clip(size, min_size, max_size)),
                label=label,
                font_scale=1.0,
                text_color=(255, 255, 255),
                vertical=False,
            )
        )
        spawned += 1

# track existing points using optical flow, remove those that move outside the water mask or have no flow, and decrement life to eventually retire old points
def track_points(prev_gray: np.ndarray, gray: np.ndarray, active: list[TrackedPoint], water_mask: np.ndarray) -> list[TrackedPoint]:
    if not active:
        return []

    prev_pts = np.array([tp.pos for tp in active], dtype=np.float32).reshape(-1, 1, 2)
    next_pts, status, _ = cv2.calcOpticalFlowPyrLK(
        prev_gray,
        gray,
        prev_pts,
        None,
        winSize=(21, 21),
        maxLevel=3,
    )

    h, w = gray.shape
    updated: list[TrackedPoint] = []

    for tp, new_pt, ok in zip(active, next_pts.reshape(-1, 2), status.reshape(-1)):
        if not ok:
            continue

        x, y = new_pt
        if not (0 <= x < w and 0 <= y < h):
            continue
        if tp.life <= 0:
            continue
        if water_mask[int(y), int(x)] == 0:
            continue

        tp.pos = new_pt
        tp.life -= 1
        updated.append(tp)

    return updated

# draw optical flow vectors as arrows on the frame, subsampled by step, and only for vectors above a magnitude threshold. Large noisy vectors are skipped, and small arrows are drawn with a fixed short length for better visibility.
def draw_vector_field(
    frame: np.ndarray,
    flow: np.ndarray,
    water_mask: np.ndarray,
    *,
    step: int,
    magnitude_threshold: float,
    vector_scale: float,
    max_arrow_length: float,
    small_arrow_length: float,
) -> None:
    h, w = water_mask.shape
    for y in range(step // 2, h, step):
        for x in range(step // 2, w, step):
            if water_mask[y, x] == 0:
                continue

            fx, fy = flow[y, x]
            mag = float(np.hypot(fx, fy))
            if mag < magnitude_threshold:
                continue

            scaled_len = float(mag * vector_scale)
            if scaled_len > max_arrow_length:
                # Skip noisy large vectors entirely.
                continue

            # Draw a fixed short arrow in flow direction so only small arrows are shown.
            ux = float(fx / (mag + 1e-6))
            uy = float(fy / (mag + 1e-6))
            dx = float(ux * small_arrow_length)
            dy = float(uy * small_arrow_length)

            end_x = int(np.clip(x + dx, 0, w - 1))
            end_y = int(np.clip(y + dy, 0, h - 1))
            cv2.arrowedLine(frame, (x, y), (end_x, end_y), (80, 255, 80), 1, tipLength=0.35)

#   sample water drop points for porticles
def sample_water_point(water_mask: np.ndarray) -> np.ndarray | None:
    ys, xs = np.where(water_mask > 0)
    if len(xs) == 0:
        return None

    idx = random.randint(0, len(xs) - 1)
    return np.array([float(xs[idx]), float(ys[idx])], dtype=np.float32)

#   small tracker point for water flow visualization, advected by optical flow with a short history trail
def initialize_flow_particles(water_mask: np.ndarray, count: int, trail_length: int) -> list[FlowTrailParticle]:
    particles: list[FlowTrailParticle] = []
    for _ in range(count):
        pos = sample_water_point(water_mask)
        if pos is None:
            break
        particles.append(
            FlowTrailParticle(
                pos=pos,
                history=deque([tuple(pos.astype(int))], maxlen=trail_length),
            )
        )
    return particles

# count flow trails (green mask particles)

def update_and_draw_flow_trails(
    frame: np.ndarray,
    particles: list[FlowTrailParticle],
    flow: np.ndarray,
    water_mask: np.ndarray,
    *,
    trail_length: int,
    trail_alpha: float,
    flow_scale: float,
    particle_radius: int,
) -> tuple[int, float]:
    if not particles:
        return 0, 0.0

    h, w = water_mask.shape
    overlay = frame.copy()
    speed_samples: list[float] = []

    for particle in particles:
        x = int(np.clip(particle.pos[0], 0, w - 1))
        y = int(np.clip(particle.pos[1], 0, h - 1))

        if water_mask[y, x] == 0:
            new_pos = sample_water_point(water_mask)
            if new_pos is None:
                continue
            particle.pos = new_pos
            particle.history = deque([tuple(new_pos.astype(int))], maxlen=trail_length)
            continue

        fx, fy = flow[y, x]
        speed_samples.append(float(np.hypot(fx, fy)))
        particle.pos = np.array(
            [
                np.clip(particle.pos[0] + fx * flow_scale, 0, w - 1),
                np.clip(particle.pos[1] + fy * flow_scale, 0, h - 1),
            ],
            dtype=np.float32,
        )

        particle.history.append(tuple(particle.pos.astype(int)))

        points = list(particle.history)
        if len(points) < 2:
            continue

        for i in range(1, len(points)):
            p0 = points[i - 1]
            p1 = points[i]
            age = i / max(1, len(points) - 1)
            color = (
                int(50 + 40 * age),
                int(150 + 105 * age),
                int(50 + 40 * age),
            )
            thickness = 1 if i < len(points) - 2 else 2
            cv2.line(overlay, p0, p1, color, thickness, cv2.LINE_AA)

        # Draw a larger particle head so flow particles are more visible.
        cv2.circle(
            overlay,
            tuple(particle.pos.astype(int)),
            particle_radius,
            (120, 255, 120),
            thickness=-1,
            lineType=cv2.LINE_AA,
        )

    cv2.addWeighted(overlay, trail_alpha, frame, 1.0 - trail_alpha, 0.0, dst=frame)
    avg_speed = float(np.mean(speed_samples)) if speed_samples else 0.0
    return len(particles), avg_speed

# draw boxes around tracked points, with labels and a color tint that inverts the underlying water texture for better visibility
def draw_edges(frame: np.ndarray, active: list[TrackedPoint], neighbor_links: int) -> None:
    coords = [tp.pos for tp in active]
    for i, p in enumerate(coords):
        dists = [(j, np.linalg.norm(p - coords[j])) for j in range(len(coords)) if j != i]
        dists.sort(key=lambda item: item[1])
        for j, _ in dists[:neighbor_links]:
            cv2.line(frame, tuple(p.astype(int)), tuple(coords[j].astype(int)), (230, 230, 230), 1)

# draw boxes around tracked points, with labels and a color tint that inverts the underlying water texture for better visibility
def draw_point_boxes(frame: np.ndarray, active: list[TrackedPoint]) -> None:
    h, w = frame.shape[:2]
    for tp in active:
        x, y = tp.pos
        s = tp.size
        x1 = int(np.clip(x - s // 2, 0, w - 1))
        y1 = int(np.clip(y - s // 2, 0, h - 1))
        x2 = int(np.clip(x + s // 2, 0, w - 1))
        y2 = int(np.clip(y + s // 2, 0, h - 1))
        if x2 <= x1 or y2 <= y1:
            continue

        roi = frame[y1:y2, x1:x2]
        if roi.size:
            frame[y1:y2, x1:x2] = 255 - roi

        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 255), 1)
        if tp.vertical:
            y_cursor = y1 + 10
            line_height = int(10 * tp.font_scale)
            for ch in tp.label:
                cv2.putText(
                    frame,
                    ch,
                    (x1 + 2, y_cursor),
                    cv2.FONT_HERSHEY_PLAIN,
                    tp.font_scale,
                    tp.text_color,
                    1,
                    cv2.LINE_AA,
                )
                y_cursor += line_height
                if y_cursor > y2 - 2:
                    break
        else:
            cv2.putText(
                frame,
                tp.label,
                (x1 + 2, y2 - 4),
                cv2.FONT_HERSHEY_PLAIN,
                tp.font_scale,
                tp.text_color,
                1,
                cv2.LINE_AA,
            )

# main rendering function that processes the video frame by frame, applying water masking, point tracking, optical flow visualization, and optional SAM 2-based masking. Outputs an annotated video and prints summary statistics.
def render_water_tracker(
    video_path: str,
    output_path: str,
    *,
    vector_step: int = 10,
    flow_smooth: float = 0.84,
    vector_scale: float = 4.7,
    magnitude_threshold: float = 0.6,
    trail_length: int = 22,
    trail_alpha: float = 0.72,
    trail_particles_count: int = 180, 
    mask_mode: str = "sam2",
    sam2_point_prompts: list[tuple[int, int]] | None = None,
    sam2_label_prompts: list[int] | None = None,
    sam2_prompt_frame_idx: int = 0,
    sam2_model_cfg: str = "configs/sam2.1/sam2.1_hiera_s.yaml",
    sam2_checkpoint_path: str = "checkpoints/sam2.1_hiera_small.pt",
    show_preview: bool = False,
    seed: int = 7,
) -> str:
    random.seed(seed)
    np.random.seed(seed)

    vector_step = max(6, vector_step)
    vector_scale = max(1.0, vector_scale)
    magnitude_threshold = max(0.1, magnitude_threshold)
    trail_length = max(4, trail_length)
    trail_alpha = float(np.clip(trail_alpha, 0.05, 1.0))
    trail_particles_count = max(10, trail_particles_count)

    sam2_masks: list[np.ndarray] | None = None
    if mask_mode.lower() == "sam2":
        sam2_masks = build_sam2_water_masks(
            video_path,
            point_prompts=sam2_point_prompts,
            label_prompts=sam2_label_prompts,
            prompt_frame_idx=sam2_prompt_frame_idx,
            model_cfg=sam2_model_cfg,
            checkpoint_path=sam2_checkpoint_path,
        )
        if sam2_masks is not None:
            print("Using SAM 2 masks for every frame.")
        else:
            print("Falling back to heuristic water masking for every frame.")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise FileNotFoundError(
            f"Unable to open '{video_path}'. Put the video in this folder or update video_path."
        )

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    fps = fps if fps > 0 else 24

    out = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width, height),
    )

    print("Processing water-only vector analytics...")

    prev_gray: np.ndarray | None = None
    prev_flow: np.ndarray | None = None
    active: list[TrackedPoint] = []
    flow_particles: list[FlowTrailParticle] = []
    boundary_points_per_frame: list[int] = []
    flow_particles_per_frame: list[int] = []
    flow_avg_speed_per_frame: list[float] = []
    frame_idx = 0

    stop_early = False
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        current_flow: np.ndarray | None = None
        if sam2_masks is not None and frame_idx < len(sam2_masks):
            water_mask = sam2_masks[frame_idx]
        else:
            water_mask = detect_water_mask(frame)

        boundary_points = count_boundary_points(water_mask)
        boundary_points_per_frame.append(boundary_points)
        print(f"Frame {frame_idx + 1}: boundary points = {boundary_points}")

        if prev_gray is not None:
            active = track_points(prev_gray, gray, active, water_mask)

            raw_flow = cv2.calcOpticalFlowFarneback(
                prev_gray,
                gray,
                None,
                pyr_scale=0.5,
                levels=3,
                winsize=21,
                iterations=3,
                poly_n=5,
                poly_sigma=1.2,
                flags=0,
            )

            if prev_flow is None:
                flow = raw_flow
            else:
                flow = cv2.addWeighted(prev_flow, flow_smooth, raw_flow, 1.0 - flow_smooth, 0.0)

            current_flow = flow

            draw_vector_field(
                frame,
                flow,
                water_mask,
                step=vector_step,
                magnitude_threshold=magnitude_threshold,
                vector_scale=vector_scale,
                max_arrow_length=10.0,
                small_arrow_length=6.0,
            )

            if not flow_particles:
                flow_particles = initialize_flow_particles(
                    water_mask,
                    count=trail_particles_count,
                    trail_length=trail_length,
                )

            flow_particle_count, flow_avg_speed = update_and_draw_flow_trails(
                frame,
                flow_particles,
                flow,
                water_mask,
                trail_length=trail_length,
                trail_alpha=trail_alpha,
                flow_scale=1.55,
                particle_radius=3,
            )
            flow_particles_per_frame.append(flow_particle_count)
            flow_avg_speed_per_frame.append(flow_avg_speed)
            print(
                f"Frame {frame_idx + 1}: flow particles = {flow_particle_count}, "
                f"avg speed = {flow_avg_speed:.4f}"
            )
            prev_flow = flow

        spawn_points(
            gray=gray,
            water_mask=water_mask,
            active=active,
            max_spawn=8,
            life_frames=16,
            min_size=14,
            max_size=36,
            flow=current_flow,
        )

        draw_edges(frame, active, neighbor_links=2)
        draw_point_boxes(frame, active)

        water_tint = frame.copy()
        water_tint[:, :, 1] = np.clip(water_tint[:, :, 1] + 35, 0, 255)
        frame = np.where(water_mask[..., None] > 0, cv2.addWeighted(frame, 0.78, water_tint, 0.22, 0), frame)

        out.write(frame)

        if show_preview:
            display_frame = cv2.resize(frame, (900, int(900 * height / width)))
            cv2.imshow("Water-Only Vector Analytics", display_frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                stop_early = True
                break

        prev_gray = gray
        frame_idx += 1

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    total_boundary_points = int(sum(boundary_points_per_frame))
    avg_boundary_points = (
        float(total_boundary_points / len(boundary_points_per_frame))
        if boundary_points_per_frame
        else 0.0
    )
    print(f"Boundary points summary: total={total_boundary_points}, average_per_frame={avg_boundary_points:.2f}")

    total_flow_particle_observations = int(sum(flow_particles_per_frame))
    avg_flow_particles_per_frame = (
        float(total_flow_particle_observations / len(flow_particles_per_frame))
        if flow_particles_per_frame
        else 0.0
    )
    overall_avg_flow_speed = (
        float(np.mean(flow_avg_speed_per_frame))
        if flow_avg_speed_per_frame
        else 0.0
    )
    print(
        "Flow particles summary: "
        f"total={total_flow_particle_observations}, "
        f"average_per_frame={avg_flow_particles_per_frame:.2f}, "
        f"average_speed={overall_avg_flow_speed:.4f}"
    )

    if stop_early:
        print("\nStopped early. Partial output saved to 'analytics_output.mp4'.")
    else:
        print("\nDone! Water-only vector analytics saved as 'analytics_output.mp4'.")

    return output_path

# main function to run the tracker and optionally generate an AI report using Qwen2.5-VL, with command-line arguments for video path, output path, and AI enabling. The AI report analyzes the river conditions based on the tracker video.
def main() -> None:
    parser = argparse.ArgumentParser(description="Run SAM2-based water tracking and optional AI flood analysis.")
    parser.add_argument(
        "--video",
        type=str,
        default=None,
        help="Path to the uploaded video file to analyze.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Optional output path for processed tracker video.",
    )
    parser.add_argument(
        "--enable-ai",
        action="store_true",
        help="Enable optional Qwen AI report generation after tracker rendering.",
    )
    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    uploaded_video_env = os.environ.get("UPLOADED_VIDEO_PATH")
    tracked_video_basename = "analytics_output.mp4"

    explicit_video = args.video or uploaded_video_env
    if explicit_video:
        video_filename = os.path.abspath(explicit_video)
        if not os.path.exists(video_filename):
            raise FileNotFoundError(
                f"Provided uploaded video was not found: {video_filename}\n"
                "Pass a valid --video path or set UPLOADED_VIDEO_PATH."
            )
    else:
        search_dirs = [
            os.getcwd(),
            script_dir,
            os.path.join(os.getcwd(), "uploads"),
            os.path.join(script_dir, "uploads"),
        ]
        extensions = ("*.mp4", "*.mov", "*.avi", "*.mkv")
        discovered: list[str] = []
        for d in search_dirs:
            for ext in extensions:
                discovered.extend(glob(os.path.join(d, ext)))

        discovered = sorted(set(os.path.abspath(p) for p in discovered if os.path.exists(p)))
        if not discovered:
            raise FileNotFoundError(
                "No uploaded video was provided and no video files were discovered.\n"
                "Use: python river_monitoring/monitor.py --video <path-to-uploaded-video>"
            )
        video_filename = discovered[0]
        print(f"No explicit uploaded video path provided; using discovered video: {video_filename}")

    tracked_video_filename = (
        os.path.abspath(args.output)
        if args.output
        else os.path.join(os.path.dirname(video_filename), tracked_video_basename)
    )
    print(f"Input video: {video_filename}")
    print(f"Output video: {tracked_video_filename}")

    print("Rendering water tracker overlay before AI analysis...")
    analysis_video = render_water_tracker(
        video_path=video_filename,
        output_path=tracked_video_filename,
        mask_mode="sam2",
        sam2_point_prompts=[(500, 450), (600, 480), (300, 420)],
        sam2_label_prompts=[1, 1, 1],
        sam2_prompt_frame_idx=0,
        show_preview=False,
    )
    print(f"Tracker output ready: {analysis_video}")

    if not args.enable_ai:
        print(f"\nTracker video saved as: {analysis_video}")
        return

    try:
        from qwen_vl_utils import process_vision_info
        from transformers import AutoProcessor, Qwen2_5_VLForConditionalGeneration
    except ImportError:
        print(
            "Qwen dependencies are not installed in this Python environment. "
            "Skipping AI report generation and keeping the tracker output only.\n"
            "Install optional dependencies to enable AI analysis: pip install qwen-vl-utils transformers"
        )
        print(f"\nTracker video saved as: {analysis_video}")
        return

    cuda_available = torch.cuda.is_available()
    if cuda_available:
        gpu_name = torch.cuda.get_device_name(0)
        print(f"CUDA detected. Running on GPU: {gpu_name}")
        model_dtype = torch.float16
    else:
        print(
            "WARNING: CUDA was not detected. The model will run on CPU and may be very slow. "
            "Install/update NVIDIA drivers and verify `nvidia-smi` works to enable GPU acceleration."
        )
        model_dtype = torch.float32

    print("Loading Qwen2.5-VL model into memory (this may take a minute)...")
    model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
        "Qwen/Qwen2.5-VL-3B-Instruct",
        torch_dtype=model_dtype,
        device_map="auto"
    )
    processor = AutoProcessor.from_pretrained("Qwen/Qwen2.5-VL-3B-Instruct")

    prompt = """
You are an automated flood control monitor. Analyze this river video carefully.
Provide a structured report on exactly these three things:
1. Water Level Trend: Is the water dangerously high, stable, or low based on the banks?
2. Debris Blockages: Are there visible logs, trash, or obstructions? (State 'None' if clear)
3. Water Turbidity: Is the water clear, murky, or heavily mud-colored (turbid)?
"""

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "video", "video": analysis_video},
                {"type": "text", "text": prompt},
            ],
        }
    ]

    print("Extracting video frames locally...")
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    image_inputs, video_inputs = process_vision_info(messages)

    inputs = processor(
        text=[text],
        images=image_inputs,
        videos=video_inputs,
        padding=True,
        return_tensors="pt",
    ).to(model.device)

    print("Running local AI analysis...")
    with torch.no_grad():
        generated_ids = model.generate(**inputs, max_new_tokens=256)

    generated_ids_trimmed = [
        out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
    ]
    output_text = processor.batch_decode(
        generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
    )[0]

    print("\n" + "="*50)
    print("🌊 LOCAL FLOOD RISK REPORT 🌊")
    print("="*50)
    print(output_text)
    print("="*50)
    print(f"\nTracker video saved as: {analysis_video}")


if __name__ == "__main__":
    main()
