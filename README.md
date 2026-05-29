# Project BANTAY-BAHA: Flood Control Project Monitoring and Flood Surveillance System

## 🌐 Live Demo [Click here to view the live site](https://aalipoyo250000002602-oss.github.io/mit003-project-bantay-baha/)


## Use Case Category : Public Safety / Disaster Risk Reduction and Management (DRRM)
<img width="955" height="1097" alt="image" src="https://github.com/user-attachments/assets/5b20a8f3-25fe-4cfe-aa3b-ee5fc4fe49fb" />

## Contributors
- Alipoyo, Alexander Y. - Section 2
- Cañete, Jhonrey A. - Section 1
- Gallego, John Deere O. - Section 1
- Maquizo, Louweben G. - Section 2
- Peligrino, Adrian Pol - Section 2

## Installation and Setup

### Prerequisites
- Node.js 18+ (Node.js 20 LTS recommended)
- pnpm 9+
- Python 3.10+ (required for video analysis pipeline)
- FFmpeg in PATH (required for processed video web playback conversion)

### 1. Install frontend dependencies
```bash
pnpm install
```

### 2. Run the frontend (Vite)
```bash
pnpm dev
```
Default URL: `http://localhost:***`

### 3. Build for production
```bash
pnpm build
```
Build output is generated in `dist/`.

### 4. Optional: Run local API for video analysis
This API receives uploaded videos and executes `river_monitoring/monitor.py`.

Create and activate a Python virtual environment at `.venv`, then install your required Python packages (for example OpenCV, Torch, and model dependencies used by `monitor.py`).

Run the API server:
```bash
pnpm dev:api
```
Default API URL: `http://localhost:***`

Health check endpoint:
`GET /api/health`

### 5. Public reports page (production build)
After running `pnpm build`, a standalone reports page is available at:
- `dist/reports.html`

If you host the `dist/` folder publicly (for example GitHub Pages, Netlify, or Vercel static hosting), users can open `/reports.html` directly.

## Notes
- Use `pnpm` for dependency management in this repository.
- `npm install` may fail because this project uses alias dependency entries that are handled correctly by pnpm.

## LVM Technology Used
This project uses an LVM (Large Vision Model) workflow through `Qwen2.5-VL-3B-Instruct` for optional video-based flood condition analysis.

The LVM is used after tracker rendering and is prompted to report:
- Water level trend
- Debris blockage presence
- Water turbidity condition

The script also uses SAM2-based segmentation for water mask propagation across frames. SAM2 supports per-frame water region extraction that improves flow-focused analysis.

Supporting runtime technologies used with the LVM pipeline:
- `cv2` (OpenCV): Handles video frame processing, mask operations, optical-flow computation, and visualization overlays.
- `deque` (from `collections`): Stores short particle trail histories efficiently with bounded length for smooth flow tracing.
- `torch` (PyTorch): Executes deep-learning inference, manages tensor operations, and enables CUDA/GPU acceleration for AI models.

## Tracer Points: Boundary and Water
Tracer points in this system are visual tracking markers generated from water-region features.

- Boundary tracer points:
	Points are prioritized near detected water boundaries (mask gradient edges), where river edge movement is most informative for flood behavior.
- Water tracer points:
	Points are sampled and tracked inside the water mask, then updated using optical flow to represent motion of water surfaces.

These tracer points are used to draw:
- Labeled point boxes
- Neighbor edge links between nearby points
- Flow vectors and particle trails for motion interpretation

## Static Utilities: Boundary and Water
Static utilities are frame-level, non-ML summary signals computed from the current water mask and optical flow outputs.

- Boundary static utility:
	Boundary pixels are computed with morphological gradient and counted per frame (`boundary points`) to summarize extent and shape activity of detected water edges.
- Water static utility:
	Water-region flow particles are counted per frame and paired with mean flow speed (`avg speed`) to summarize overall water motion intensity.

At the end of processing, the tracker reports:
- Total and average boundary points per frame
- Total and average flow particle observations per frame
- Overall average flow speed
