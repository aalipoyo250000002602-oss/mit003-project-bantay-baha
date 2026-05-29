import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { saveFloodAnalysisReport } from './utils/floodReportStorage';
import { addVideoProcessedNotification } from './utils/analysisNotificationStorage';
import { clearVideoAnalysisDraft, readVideoAnalysisDraft, writeVideoAnalysisDraft } from './utils/videoAnalysisDraftStorage';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  BarChart3,
  Search,
  MapPin,
  Fuel,
  Wrench,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  TrendingUp,
  Video,
  X
} from 'lucide-react';

type VideoAnalysisResult = {
  waterLevelTrend: string;
  debrisBlockages: string;
  waterTurbidity: string;
  summary: string;
  confidence: number;
  analyzedFrames: number;
  durationSeconds: number;
  processedVideoUrl?: string;
  frameTimeline: Array<{
    frame: number;
    timestampSeconds: number;
    waterLevel: 'low' | 'stable' | 'high';
    debris: 'none' | 'minor' | 'detected';
    turbidity: 'clear' | 'murky' | 'turbid';
    boundaryPoints: number;
    trackerBoxes: Array<{
      id: string;
      label: string;
      color: 'blue' | 'amber' | 'emerald';
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  }>;
};

type RemoteVideoAnalysisResponse = {
  processedVideoUrl: string;
  boundaryPointsTotal: number | null;
  boundaryPointsAveragePerFrame: number | null;
  flowParticlesTotal: number | null;
  flowParticlesAveragePerFrame: number | null;
  flowParticlesAverageSpeed: number | null;
  flowParticleFrames: Array<{
    frame: number;
    flowParticles: number;
    avgSpeed: number;
  }>;
};

type FlowFrameMetric = {
  frame: number;
  flowParticles: number;
  avgSpeed: number;
};

type FramePreview = {
  frame: number;
  timestampSeconds: number;
  imageUrl: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((acc, value) => acc + value, 0) / values.length;
};

const getNearestFrameIndex = <T extends { timestampSeconds: number }>(
  frames: T[],
  currentTimeSeconds: number,
) => {
  if (frames.length === 0) {
    return 0;
  }

  let nearestIndex = 0;
  let nearestDistance = Math.abs(frames[0].timestampSeconds - currentTimeSeconds);
  for (let index = 1; index < frames.length; index += 1) {
    const distance = Math.abs(frames[index].timestampSeconds - currentTimeSeconds);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
};

const getTrackerColorClasses = (color: 'blue' | 'amber' | 'emerald') => {
  switch (color) {
    case 'blue':
      return {
        border: 'border-blue-500',
        badge: 'bg-blue-600',
      };
    case 'amber':
      return {
        border: 'border-amber-500',
        badge: 'bg-amber-500',
      };
    default:
      return {
        border: 'border-emerald-500',
        badge: 'bg-emerald-600',
      };
  }
};

const getWaterLevelLabel = (level: 'low' | 'stable' | 'high') => {
  switch (level) {
    case 'high':
      return 'Dangerously high';
    case 'stable':
      return 'Stable';
    default:
      return 'Low';
  }
};

const getDebrisLabel = (debris: 'none' | 'minor' | 'detected') => {
  switch (debris) {
    case 'detected':
      return 'Visible debris/obstructions detected';
    case 'minor':
      return 'Minor floating debris observed';
    default:
      return 'None';
  }
};

const getTurbidityLabel = (turbidity: 'clear' | 'murky' | 'turbid') => {
  switch (turbidity) {
    case 'turbid':
      return 'Heavily mud-colored (turbid)';
    case 'murky':
      return 'Murky';
    default:
      return 'Clear';
  }
};

const buildFrameSummary = (
  waterLevel: 'low' | 'stable' | 'high',
  debris: 'none' | 'minor' | 'detected',
  turbidity: 'clear' | 'murky' | 'turbid',
) => {
  return `${getWaterLevelLabel(waterLevel)} water level, ${getDebrisLabel(debris).toLowerCase()}, ${getTurbidityLabel(turbidity).toLowerCase()}.`;
};

const formatDecimal = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const dynamicReportChartConfig = {
  boundaryPoints: {
    label: 'Boundary Points',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const flowReportChartConfig = {
  flowParticles: {
    label: 'Flow Particles',
    color: 'hsl(var(--chart-2))',
  },
  avgSpeed: {
    label: 'Avg Speed',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const estimateBoundaryPoints = (imageData: ImageData, width: number, height: number) => {
  const { data } = imageData;
  const waterMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const dataIdx = idx * 4;
      const red = data[dataIdx];
      const green = data[dataIdx + 1];
      const blue = data[dataIdx + 2];

      const inLowerRegion = y >= Math.floor(height * 0.48);
      const blueWater = blue > 45 && blue > green * 1.05 && blue > red * 1.1;
      const muddyWater = red > 60 && green > 35 && red > green * 1.02 && green > blue * 1.05;

      waterMask[idx] = inLowerRegion && (blueWater || muddyWater) ? 1 : 0;
    }
  }

  let boundaryCount = 0;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = y * width + x;
      if (waterMask[idx] === 0) {
        continue;
      }

      const hasOutsideNeighbor =
        waterMask[idx - 1] === 0 ||
        waterMask[idx + 1] === 0 ||
        waterMask[idx - width] === 0 ||
        waterMask[idx + width] === 0 ||
        waterMask[idx - width - 1] === 0 ||
        waterMask[idx - width + 1] === 0 ||
        waterMask[idx + width - 1] === 0 ||
        waterMask[idx + width + 1] === 0;

      if (hasOutsideNeighbor) {
        boundaryCount += 1;
      }
    }
  }

  return boundaryCount;
};

const getWaterLevelNodeColor = (level: 'low' | 'stable' | 'high') => {
  switch (level) {
    case 'high':
      return 'bg-blue-600';
    case 'stable':
      return 'bg-blue-400';
    default:
      return 'bg-blue-200';
  }
};

const getDebrisNodeColor = (debris: 'none' | 'minor' | 'detected') => {
  switch (debris) {
    case 'detected':
      return 'bg-amber-600';
    case 'minor':
      return 'bg-amber-400';
    default:
      return 'bg-amber-200';
  }
};

const getTurbidityNodeColor = (turbidity: 'clear' | 'murky' | 'turbid') => {
  switch (turbidity) {
    case 'turbid':
      return 'bg-emerald-700';
    case 'murky':
      return 'bg-emerald-500';
    default:
      return 'bg-emerald-300';
  }
};

const getResultBoxStyle = (parameter: 'water' | 'debris' | 'turbidity' | 'flow') => {
  switch (parameter) {
    case 'water':
      return {
        box: 'border-blue-200 bg-blue-50',
        tag: 'bg-blue-100 text-blue-800',
      };
    case 'debris':
      return {
        box: 'border-amber-200 bg-amber-50',
        tag: 'bg-amber-100 text-amber-800',
      };
    case 'flow':
      return {
        box: 'border-lime-200 bg-lime-50',
        tag: 'bg-lime-100 text-lime-800',
      };
    default:
      return {
        box: 'border-emerald-200 bg-emerald-50',
        tag: 'bg-emerald-100 text-emerald-800',
      };
  }
};

const waitForVideoEvent = (video: HTMLVideoElement, eventName: 'loadedmetadata' | 'seeked') =>
  new Promise<void>((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Unable to read the selected video.'));
    };
    const cleanup = () => {
      video.removeEventListener(eventName, onReady);
      video.removeEventListener('error', onError);
    };

    video.addEventListener(eventName, onReady, { once: true });
    video.addEventListener('error', onError, { once: true });
  });

const extractVideoFramePreviews = async (videoFile: File): Promise<FramePreview[]> => {
  const videoElement = document.createElement('video');
  videoElement.preload = 'metadata';
  videoElement.muted = true;
  videoElement.playsInline = true;

  const objectUrl = URL.createObjectURL(videoFile);
  videoElement.src = objectUrl;

  try {
    await waitForVideoEvent(videoElement, 'loadedmetadata');

    const duration = Number.isFinite(videoElement.duration) && videoElement.duration > 0
      ? videoElement.duration
      : 0;

    const frameSamples = duration > 0 ? clamp(Math.floor(duration), 8, 24) : 8;

    const canvas = document.createElement('canvas');
    const width = 224;
    const height = 126;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Unable to generate frame timeline preview.');
    }

    const previews: FramePreview[] = [];

    for (let sampleIndex = 0; sampleIndex < frameSamples; sampleIndex += 1) {
      if (duration > 0) {
        const timestamp = ((sampleIndex + 1) * duration) / (frameSamples + 1);
        videoElement.currentTime = timestamp;
        await waitForVideoEvent(videoElement, 'seeked');
      }

      context.drawImage(videoElement, 0, 0, width, height);
      previews.push({
        frame: sampleIndex + 1,
        timestampSeconds: duration > 0 ? ((sampleIndex + 1) * duration) / (frameSamples + 1) : sampleIndex,
        imageUrl: canvas.toDataURL('image/jpeg', 0.72),
      });
    }

    return previews;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const extractFramePreviewsFromVideoUrl = async (
  videoUrl: string,
  targetFrames: number,
): Promise<FramePreview[]> => {
  const videoElement = document.createElement('video');
  videoElement.preload = 'metadata';
  videoElement.muted = true;
  videoElement.playsInline = true;
  videoElement.src = videoUrl;

  await waitForVideoEvent(videoElement, 'loadedmetadata');

  const duration = Number.isFinite(videoElement.duration) && videoElement.duration > 0
    ? videoElement.duration
    : 0;
  const frameSamples = duration > 0
    ? clamp(targetFrames || Math.floor(duration), 8, 24)
    : 8;

  const canvas = document.createElement('canvas');
  const width = 224;
  const height = 126;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Unable to generate frame timeline preview.');
  }

  const previews: FramePreview[] = [];

  for (let sampleIndex = 0; sampleIndex < frameSamples; sampleIndex += 1) {
    if (duration > 0) {
      const timestamp = ((sampleIndex + 1) * duration) / (frameSamples + 1);
      videoElement.currentTime = timestamp;
      await waitForVideoEvent(videoElement, 'seeked');
    }

    context.drawImage(videoElement, 0, 0, width, height);
    previews.push({
      frame: sampleIndex + 1,
      timestampSeconds: duration > 0 ? ((sampleIndex + 1) * duration) / (frameSamples + 1) : sampleIndex,
      imageUrl: canvas.toDataURL('image/jpeg', 0.72),
    });
  }

  return previews;
};

const extractFrameMetrics = (imageData: ImageData, width: number, height: number) => {
  const { data } = imageData;
  const pixelCount = width * height;
  const luminance = new Float32Array(pixelCount);

  let luminanceSum = 0;
  let brownPixels = 0;

  for (let index = 0, pixelIndex = 0; index < data.length; index += 4, pixelIndex += 1) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];

    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    luminance[pixelIndex] = luma;
    luminanceSum += luma;

    if (red > 60 && red > green * 1.05 && green > blue * 1.05) {
      brownPixels += 1;
    }
  }

  let textureDiffSum = 0;
  let textureSamples = 0;

  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const idx = y * width + x;
      textureDiffSum += Math.abs(luminance[idx] - luminance[idx + 1]);
      textureDiffSum += Math.abs(luminance[idx] - luminance[idx + width]);
      textureSamples += 2;
    }
  }

  return {
    luminance,
    brownRatio: brownPixels / pixelCount,
    textureScore: clamp(textureDiffSum / (Math.max(textureSamples, 1) * 255), 0, 1),
    avgLuminance: luminanceSum / pixelCount,
  };
};

const calculateMotionScore = (previous: Float32Array, next: Float32Array) => {
  const pixelCount = Math.min(previous.length, next.length);
  if (pixelCount === 0) {
    return 0;
  }

  let diffSum = 0;
  for (let index = 0; index < pixelCount; index += 1) {
    diffSum += Math.abs(previous[index] - next[index]);
  }

  return clamp(diffSum / (pixelCount * 255), 0, 1);
};

const analyzeUploadedVideoLocally = async (videoFile: File): Promise<VideoAnalysisResult> => {
  const videoElement = document.createElement('video');
  videoElement.preload = 'metadata';
  videoElement.muted = true;
  videoElement.playsInline = true;

  const objectUrl = URL.createObjectURL(videoFile);
  videoElement.src = objectUrl;

  try {
    await waitForVideoEvent(videoElement, 'loadedmetadata');

    const duration = Number.isFinite(videoElement.duration) && videoElement.duration > 0
      ? videoElement.duration
      : 0;

    const frameSamples = duration > 0
      ? clamp(Math.floor(duration / 2), 6, 18)
      : 6;

    const canvas = document.createElement('canvas');
    const width = 192;
    const height = 108;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Unable to start local frame analysis.');
    }

    const brownRatios: number[] = [];
    const textureScores: number[] = [];
    const motionScores: number[] = [];
    const brightnessLevels: number[] = [];
    const frameTimeline: VideoAnalysisResult['frameTimeline'] = [];
    let previousLuminance: Float32Array | null = null;

    for (let sampleIndex = 0; sampleIndex < frameSamples; sampleIndex += 1) {
      if (duration > 0) {
        const timestamp = ((sampleIndex + 1) * duration) / (frameSamples + 1);
        videoElement.currentTime = timestamp;
        await waitForVideoEvent(videoElement, 'seeked');
      }

      context.drawImage(videoElement, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const metrics = extractFrameMetrics(imageData, width, height);
      const boundaryPoints = estimateBoundaryPoints(imageData, width, height);

      brownRatios.push(metrics.brownRatio);
      textureScores.push(metrics.textureScore);
      brightnessLevels.push(metrics.avgLuminance / 255);

      if (previousLuminance) {
        motionScores.push(calculateMotionScore(previousLuminance, metrics.luminance));
      }
      previousLuminance = metrics.luminance;

      const frameTurbidityIndex = clamp(
        metrics.brownRatio * 0.6 + metrics.textureScore * 0.3 + (1 - metrics.avgLuminance / 255) * 0.1,
        0,
        1,
      );
      const frameMotionScore = motionScores.length > 0 ? motionScores[motionScores.length - 1] : 0;
      const frameFloodIndex = clamp(frameMotionScore * 0.45 + frameTurbidityIndex * 0.35 + metrics.textureScore * 0.2, 0, 1);
      const frameDebrisIndex = clamp(metrics.textureScore * 0.7 + (1 - clamp(frameMotionScore * 1.25, 0, 1)) * 0.3, 0, 1);

      const waterLevel = frameFloodIndex >= 0.68 ? 'high' : frameFloodIndex >= 0.4 ? 'stable' : 'low';
      const debris = frameDebrisIndex >= 0.64 ? 'detected' : frameDebrisIndex >= 0.4 ? 'minor' : 'none';
      const turbidity = frameTurbidityIndex >= 0.7 ? 'turbid' : frameTurbidityIndex >= 0.45 ? 'murky' : 'clear';

      const trackerBoxes: VideoAnalysisResult['frameTimeline'][number]['trackerBoxes'] = [
        {
          id: `water-${sampleIndex}`,
          label: `Water ${getWaterLevelLabel(waterLevel)}`,
          color: 'blue',
          x: 10,
          y: 58,
          width: 80,
          height: 34,
        },
        {
          id: `turbidity-${sampleIndex}`,
          label: `Turbidity ${getTurbidityLabel(turbidity)}`,
          color: 'emerald',
          x: 8,
          y: 8,
          width: 44,
          height: 14,
        },
      ];

      if (debris !== 'none') {
        trackerBoxes.push({
          id: `debris-main-${sampleIndex}`,
          label: debris === 'detected' ? 'Debris cluster' : 'Debris detected',
          color: 'amber',
          x: 55 + (sampleIndex % 3) * 6,
          y: 48 + (sampleIndex % 2) * 6,
          width: debris === 'detected' ? 20 : 16,
          height: debris === 'detected' ? 16 : 12,
        });
      }

      if (debris === 'detected') {
        trackerBoxes.push({
          id: `debris-secondary-${sampleIndex}`,
          label: 'Floating object',
          color: 'amber',
          x: 20 + (sampleIndex % 4) * 5,
          y: 42,
          width: 12,
          height: 10,
        });
      }

      frameTimeline.push({
        frame: sampleIndex + 1,
        timestampSeconds: duration > 0 ? ((sampleIndex + 1) * duration) / (frameSamples + 1) : sampleIndex,
        waterLevel,
        debris,
        turbidity,
        boundaryPoints,
        trackerBoxes,
      });
    }

    const avgBrown = average(brownRatios);
    const avgTexture = average(textureScores);
    const avgMotion = average(motionScores);
    const avgBrightness = average(brightnessLevels);

    const turbidityIndex = clamp(avgBrown * 0.6 + avgTexture * 0.3 + (1 - avgBrightness) * 0.1, 0, 1);
    const floodIndex = clamp(avgMotion * 0.45 + turbidityIndex * 0.35 + avgTexture * 0.2, 0, 1);
    const debrisIndex = clamp(avgTexture * 0.7 + (1 - clamp(avgMotion * 1.25, 0, 1)) * 0.3, 0, 1);

    const waterTurbidity = getTurbidityLabel(
      turbidityIndex >= 0.7 ? 'turbid' : turbidityIndex >= 0.45 ? 'murky' : 'clear',
    );

    const waterLevelTrend = getWaterLevelLabel(
      floodIndex >= 0.68 ? 'high' : floodIndex >= 0.4 ? 'stable' : 'low',
    );

    const debrisBlockages = getDebrisLabel(
      debrisIndex >= 0.64 ? 'detected' : debrisIndex >= 0.4 ? 'minor' : 'none',
    );

    const confidence = clamp(
      0.58 + Math.min(frameSamples, 12) * 0.018 + (duration >= 10 ? 0.08 : 0),
      0.6,
      0.92,
    );

    return {
      waterLevelTrend,
      debrisBlockages,
      waterTurbidity,
      summary: `${waterLevelTrend} conditions with ${waterTurbidity.toLowerCase()} water and ${debrisBlockages.toLowerCase()}.`,
      confidence,
      analyzedFrames: frameSamples,
      durationSeconds: duration,
      frameTimeline,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const analyzeUploadedVideoViaApi = async (videoFile: File): Promise<RemoteVideoAnalysisResponse> => {
  const buffer = await videoFile.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  const base64Video = btoa(binary);

  const response = await fetch('/api/analyze-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: videoFile.name,
      base64Video,
    }),
  });

  if (!response.ok) {
    let message = 'Remote video analysis failed.';
    try {
      const payload = await response.json();
      if (payload?.error) {
        message = String(payload.error);
      }
    } catch {
      // Ignore JSON parse failures and use default message.
    }
    throw new Error(message);
  }

  return response.json();
};



const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'In Transit': return 'bg-blue-100 text-blue-800';
    case 'Maintenance': return 'bg-orange-100 text-orange-800';
    case 'Inactive': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case 'Valid': return 'bg-green-100 text-green-800';
    case 'Expired': return 'bg-red-100 text-red-800';
    case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const progressConfig = [
  { maxPercent: 20, label: 'Extracting video metadata...' },
  { maxPercent: 40, label: 'Decoding visual streams...' },
  { maxPercent: 60, label: 'Analyzing frame sequences...' },
  { maxPercent: 80, label: 'Processing audio tracks...' },
  { maxPercent: 90, label: 'Crunching fames' },
  { maxPercent: 92, label: 'Consolidating analysis data...' },
  { maxPercent: 94, label: 'Verifying file integrity...' },
  { maxPercent: 96, label: 'Generating result logs...' },
  { maxPercent: 98, label: 'Optimizing final output...' },
  { maxPercent: 99, label: 'Cleaning up temporary files...' },
  { maxPercent: 100, label: 'Performing final validation...' },
];

const getProgressLabel = (currentPercent: number) => {
  if (currentPercent >= 100) {
    return 'Analysis complete!';
  }

  const currentStep = progressConfig.find((step) => currentPercent < step.maxPercent);
  return currentStep ? currentStep.label : 'Processing...';
};

export function VehiclesModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);
  const [isPreparingTimeline, setIsPreparingTimeline] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [boundaryPointsTotal, setBoundaryPointsTotal] = useState<number | null>(null);
  const [boundaryPointsAveragePerFrame, setBoundaryPointsAveragePerFrame] = useState<number | null>(null);
  const [flowParticlesTotal, setFlowParticlesTotal] = useState<number | null>(null);
  const [flowParticlesAveragePerFrame, setFlowParticlesAveragePerFrame] = useState<number | null>(null);
  const [flowParticlesAverageSpeed, setFlowParticlesAverageSpeed] = useState<number | null>(null);
  const [flowFrameMetrics, setFlowFrameMetrics] = useState<FlowFrameMetric[]>([]);
  const [framePreviews, setFramePreviews] = useState<FramePreview[]>([]);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [saveFileName, setSaveFileName] = useState('');
  const [saveAddress, setSaveAddress] = useState('');
  const [saveDateTaken, setSaveDateTaken] = useState('');
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedPreviewRef = useRef<HTMLVideoElement>(null);
  const timelineRequestRef = useRef(0);
  const progressTimerRef = useRef<number | null>(null);
  const analysisRequestRef = useRef(0);
  const isMountedRef = useRef(true);
  const recoveryTimelineRequestRef = useRef(0);

  const selectedPreviewTimestamp = framePreviews[selectedFrameIndex]?.timestampSeconds ?? previewCurrentTime;
  const activeFrameIndex = analysisResult
    ? getNearestFrameIndex(analysisResult.frameTimeline, selectedPreviewTimestamp)
    : 0;
  const activeFrame = analysisResult?.frameTimeline[activeFrameIndex] ?? null;
  const timelineBoundaryTotal = analysisResult
    ? analysisResult.frameTimeline.reduce((sum, frame) => sum + frame.boundaryPoints, 0)
    : 0;
  const timelineBoundaryAverage = analysisResult && analysisResult.frameTimeline.length > 0
    ? timelineBoundaryTotal / analysisResult.frameTimeline.length
    : 0;
  const dynamicChartData = analysisResult
    ? analysisResult.frameTimeline.map((frame, index) => ({
        frameLabel: `F${frame.frame}`,
        boundaryPoints: frame.boundaryPoints,
        isActive: index === activeFrameIndex ? 1 : 0,
      }))
    : [];
  const dynamicChartWindow = dynamicChartData.length <= 12
    ? dynamicChartData
    : dynamicChartData.slice(
        Math.max(0, activeFrameIndex - 5),
        Math.min(dynamicChartData.length, activeFrameIndex + 7),
      );
  const flowChartData = flowFrameMetrics.map((item) => ({
    frameLabel: `F${item.frame}`,
    frame: item.frame,
    flowParticles: item.flowParticles,
    avgSpeed: item.avgSpeed,
  }));
  const flowChartWindow = flowChartData.length <= 12
    ? flowChartData
    : flowChartData.slice(
        Math.max(0, activeFrameIndex - 5),
        Math.min(flowChartData.length, activeFrameIndex + 7),
      );
  const activeFlowMetric = flowFrameMetrics.find((item) => item.frame === activeFrame?.frame);
  const boundaryValues = analysisResult
    ? analysisResult.frameTimeline.map((frame) => frame.boundaryPoints)
    : [];
  const boundaryPeak = boundaryValues.length > 0 ? Math.max(...boundaryValues) : null;
  const boundaryLow = boundaryValues.length > 0 ? Math.min(...boundaryValues) : null;
  const boundaryDataPoints = boundaryValues.length;
  const analysisProgressLabel = getProgressLabel(analysisProgress);
  const canSaveReport = Boolean(
    analysisResult &&
    processedVideoUrl &&
    activeFrame &&
    saveFileName.trim() &&
    saveAddress.trim() &&
    saveDateTaken,
  );

  const resetAnalysisState = () => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    analysisRequestRef.current += 1;
    setIsAnalyzingVideo(false);
    setAnalysisProgress(0);
    setProcessedVideoUrl(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setBoundaryPointsTotal(null);
    setBoundaryPointsAveragePerFrame(null);
    setFlowParticlesTotal(null);
    setFlowParticlesAveragePerFrame(null);
    setFlowParticlesAverageSpeed(null);
    setFlowFrameMetrics([]);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo);
      }

      const requestId = timelineRequestRef.current + 1;
      timelineRequestRef.current = requestId;

      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo(videoUrl);
      setUploadedVideoFile(file);
      setProcessedVideoUrl(null);
      setVideoFileName(file.name);
      setAnalysisError(null);
      setAnalysisResult(null);
      setBoundaryPointsTotal(null);
      setBoundaryPointsAveragePerFrame(null);
      setFlowParticlesTotal(null);
      setFlowParticlesAveragePerFrame(null);
      setFlowParticlesAverageSpeed(null);
      setFlowFrameMetrics([]);
      setAnalysisProgress(0);
      setFramePreviews([]);
      setSelectedFrameIndex(0);
      setPreviewCurrentTime(0);
      setIsPreparingTimeline(true);
      setSaveStatusMessage(null);
      setSaveErrorMessage(null);
      setSaveFileName(file.name.replace(/\.[^/.]+$/, ''));
      setSaveAddress('');
      setSaveDateTaken('');

      extractVideoFramePreviews(file)
        .then((previews) => {
          if (timelineRequestRef.current !== requestId) {
            return;
          }
          setFramePreviews(previews);
          setSelectedFrameIndex(0);
          setPreviewCurrentTime(previews[0]?.timestampSeconds ?? 0);
        })
        .catch(() => {
          if (timelineRequestRef.current !== requestId) {
            return;
          }
          setFramePreviews([]);
        })
        .finally(() => {
          if (timelineRequestRef.current === requestId) {
            setIsPreparingTimeline(false);
          }
        });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo);
    }
    setUploadedVideo(null);
    setUploadedVideoFile(null);
    setProcessedVideoUrl(null);
    setVideoFileName('');
    setAnalysisError(null);
    setAnalysisResult(null);
    setBoundaryPointsTotal(null);
    setBoundaryPointsAveragePerFrame(null);
    setFlowParticlesTotal(null);
    setFlowParticlesAveragePerFrame(null);
    setFlowParticlesAverageSpeed(null);
    setFlowFrameMetrics([]);
    setAnalysisProgress(0);
    setFramePreviews([]);
    setSelectedFrameIndex(0);
    setPreviewCurrentTime(0);
    setIsPreparingTimeline(false);
    setSaveStatusMessage(null);
    setSaveErrorMessage(null);
    setSaveFileName('');
    setSaveAddress('');
    setSaveDateTaken('');
    clearVideoAnalysisDraft();
    timelineRequestRef.current += 1;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const frame = framePreviews[selectedFrameIndex];
    const previewVideo = processedPreviewRef.current;

    if (!frame || !previewVideo) {
      return;
    }

    const seekToFrame = () => {
      previewVideo.currentTime = frame.timestampSeconds;
      previewVideo.pause();
      setPreviewCurrentTime(frame.timestampSeconds);
    };

    if (previewVideo.readyState >= 1) {
      seekToFrame();
      return;
    }

    previewVideo.addEventListener('loadedmetadata', seekToFrame, { once: true });
    return () => {
      previewVideo.removeEventListener('loadedmetadata', seekToFrame);
    };
  }, [framePreviews, selectedFrameIndex, uploadedVideo]);

  useEffect(() => {
    if (!processedVideoUrl || framePreviews.length > 0 || isPreparingTimeline) {
      return;
    }

    const desiredFrames = analysisResult?.frameTimeline.length ?? 0;
    const requestId = recoveryTimelineRequestRef.current + 1;
    recoveryTimelineRequestRef.current = requestId;
    setIsPreparingTimeline(true);

    extractFramePreviewsFromVideoUrl(processedVideoUrl, desiredFrames)
      .then((previews) => {
        if (!isMountedRef.current || recoveryTimelineRequestRef.current !== requestId || previews.length === 0) {
          return;
        }

        setFramePreviews(previews);
        setSelectedFrameIndex((prev) => Math.min(prev, Math.max(previews.length - 1, 0)));

        const draft = readVideoAnalysisDraft();
        if (draft?.status === 'ready' && draft.payload) {
          writeVideoAnalysisDraft({
            ...draft,
            payload: {
              ...draft.payload,
              framePreviews: previews,
            },
            updatedAt: new Date().toISOString(),
          });
        }
      })
      .catch(() => {
        // Keep timeline fallback controls when thumbnail extraction fails.
      })
      .finally(() => {
        if (isMountedRef.current && recoveryTimelineRequestRef.current === requestId) {
          setIsPreparingTimeline(false);
        }
      });
  }, [processedVideoUrl, framePreviews.length, analysisResult, isPreparingTimeline]);

  const handleAnalyzeVideo = async () => {
    if (!uploadedVideoFile || isAnalyzingVideo) {
      return;
    }

    const requestId = analysisRequestRef.current + 1;
    analysisRequestRef.current = requestId;

    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    setIsAnalyzingVideo(true);
    setAnalysisError(null);
    setAnalysisProgress(5);
    writeVideoAnalysisDraft({
      status: 'processing',
      updatedAt: new Date().toISOString(),
      videoFileName: videoFileName || uploadedVideoFile.name,
      analysisProgress: 5,
    });

    progressTimerRef.current = window.setInterval(() => {
      setAnalysisProgress((prev) => {
        if (!isMountedRef.current || analysisRequestRef.current !== requestId) {
          return prev;
        }
        if (prev >= 94) {
          return prev;
        }
        const step = Math.floor(Math.random() * 6) + 2;
        const next = Math.min(94, prev + step);
        writeVideoAnalysisDraft({
          status: 'processing',
          updatedAt: new Date().toISOString(),
          videoFileName: videoFileName || uploadedVideoFile.name,
          analysisProgress: next,
        });
        return next;
      });
    }, 700);

    try {
      const remotePromise = analyzeUploadedVideoViaApi(uploadedVideoFile);
      const localPromise = analyzeUploadedVideoLocally(uploadedVideoFile);

      const remoteResult = await remotePromise;
      if (analysisRequestRef.current !== requestId) {
        return;
      }

      if (isMountedRef.current) {
        setProcessedVideoUrl(remoteResult.processedVideoUrl);
        setBoundaryPointsTotal(remoteResult.boundaryPointsTotal);
        setBoundaryPointsAveragePerFrame(remoteResult.boundaryPointsAveragePerFrame);
        setFlowParticlesTotal(remoteResult.flowParticlesTotal);
        setFlowParticlesAveragePerFrame(remoteResult.flowParticlesAveragePerFrame);
        setFlowParticlesAverageSpeed(remoteResult.flowParticlesAverageSpeed);
        setFlowFrameMetrics(remoteResult.flowParticleFrames ?? []);
        setAnalysisProgress((prev) => Math.max(prev, 97));
      }

      let resolvedLocalResult: VideoAnalysisResult | null = null;

      try {
        const localResult = await localPromise;
        if (analysisRequestRef.current !== requestId) {
          return;
        }

        resolvedLocalResult = {
          ...localResult,
          processedVideoUrl: remoteResult.processedVideoUrl,
        };

        if (isMountedRef.current) {
          setAnalysisResult(resolvedLocalResult);
        }
      } catch {
        if (analysisRequestRef.current !== requestId) {
          return;
        }

        if (isMountedRef.current) {
          setAnalysisResult(null);
          setAnalysisError('Rendered video is ready, but frame-by-frame metrics could not be generated for this file.');
        }
      }

      if (progressTimerRef.current !== null) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      if (analysisRequestRef.current !== requestId) {
        return;
      }

      const draftPayload = resolvedLocalResult
        ? {
            videoFileName: videoFileName || uploadedVideoFile.name,
            processedVideoUrl: remoteResult.processedVideoUrl,
            analysisResult: resolvedLocalResult,
            boundaryPointsTotal: remoteResult.boundaryPointsTotal,
            boundaryPointsAveragePerFrame: remoteResult.boundaryPointsAveragePerFrame,
            flowParticlesTotal: remoteResult.flowParticlesTotal,
            flowParticlesAveragePerFrame: remoteResult.flowParticlesAveragePerFrame,
            flowParticlesAverageSpeed: remoteResult.flowParticlesAverageSpeed,
            flowFrameMetrics: remoteResult.flowParticleFrames ?? [],
            framePreviews,
          }
        : {
            videoFileName: videoFileName || uploadedVideoFile.name,
            processedVideoUrl: remoteResult.processedVideoUrl,
            analysisResult: null,
            boundaryPointsTotal: remoteResult.boundaryPointsTotal,
            boundaryPointsAveragePerFrame: remoteResult.boundaryPointsAveragePerFrame,
            flowParticlesTotal: remoteResult.flowParticlesTotal,
            flowParticlesAveragePerFrame: remoteResult.flowParticlesAveragePerFrame,
            flowParticlesAverageSpeed: remoteResult.flowParticlesAverageSpeed,
            flowFrameMetrics: remoteResult.flowParticleFrames ?? [],
            framePreviews,
          };

      writeVideoAnalysisDraft({
        status: 'ready',
        updatedAt: new Date().toISOString(),
        videoFileName: videoFileName || uploadedVideoFile.name,
        analysisProgress: 100,
        payload: draftPayload,
      });

      addVideoProcessedNotification(videoFileName || uploadedVideoFile.name, new Date().toISOString());

      if (isMountedRef.current) {
        setAnalysisProgress(100);
      } else {
        window.dispatchEvent(new Event('video-analysis-ready-unsaved'));
      }
    } catch (error) {
      if (analysisRequestRef.current !== requestId) {
        return;
      }

      clearVideoAnalysisDraft();

      if (progressTimerRef.current !== null) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      if (isMountedRef.current) {
        setAnalysisProgress(0);
        setAnalysisResult(null);
        setProcessedVideoUrl(null);
        setBoundaryPointsTotal(null);
        setBoundaryPointsAveragePerFrame(null);
        setFlowParticlesTotal(null);
        setFlowParticlesAveragePerFrame(null);
        setFlowParticlesAverageSpeed(null);
        setFlowFrameMetrics([]);
        setAnalysisError(error instanceof Error ? error.message : 'Video analysis failed. Please try another file.');
      }
    } finally {
      if (isMountedRef.current && analysisRequestRef.current === requestId) {
        setIsAnalyzingVideo(false);
      }
    }
  };

  const handleSaveReport = () => {
    if (!analysisResult || !processedVideoUrl || !activeFrame) {
      setSaveErrorMessage('Analyze a video first before saving a report.');
      setSaveStatusMessage(null);
      return;
    }

    if (!saveFileName.trim() || !saveAddress.trim() || !saveDateTaken) {
      setSaveErrorMessage('Please provide file name, address, and date taken.');
      setSaveStatusMessage(null);
      return;
    }

    const selectedFramePreview = framePreviews[selectedFrameIndex];

    saveFloodAnalysisReport({
      fileName: saveFileName.trim(),
      address: saveAddress.trim(),
      dateTaken: saveDateTaken,
      videoOriginalName: videoFileName || uploadedVideoFile?.name || 'Uploaded Video',
      processedVideoUrl,
      frameLabel: `F${activeFrame.frame}`,
      frameTimestampSeconds: activeFrame.timestampSeconds,
      framePreviewImageUrl: selectedFramePreview?.imageUrl ?? '',
      waterLevelTrend: getWaterLevelLabel(activeFrame.waterLevel),
      debrisBlockages: getDebrisLabel(activeFrame.debris),
      waterTurbidity: getTurbidityLabel(activeFrame.turbidity),
      boundaryPointsThisFrame: activeFrame.boundaryPoints,
      boundaryPointsTotal: boundaryPointsTotal ?? timelineBoundaryTotal,
      boundaryAveragePerFrame: boundaryPointsAveragePerFrame ?? timelineBoundaryAverage,
      flowParticlesThisFrame: activeFlowMetric ? activeFlowMetric.flowParticles : null,
      flowParticlesTotal,
      flowAveragePerFrame: flowParticlesAveragePerFrame,
      flowSpeedThisFrame: activeFlowMetric ? activeFlowMetric.avgSpeed : null,
      flowAverageSpeed: flowParticlesAverageSpeed,
      flowDataPoints: flowFrameMetrics.length,
      frameTimeline: analysisResult.frameTimeline.map((item) => ({
        frame: item.frame,
        timestampSeconds: item.timestampSeconds,
        waterLevel: item.waterLevel,
        debris: item.debris,
        turbidity: item.turbidity,
        boundaryPoints: item.boundaryPoints,
      })),
      flowFrameMetrics: flowFrameMetrics.map((item) => ({
        frame: item.frame,
        flowParticles: item.flowParticles,
        avgSpeed: item.avgSpeed,
      })),
      framePreviews: framePreviews.map((item) => ({
        frame: item.frame,
        timestampSeconds: item.timestampSeconds,
        imageUrl: item.imageUrl,
      })),
    });

    window.dispatchEvent(new Event('flood-report-saved'));
    clearVideoAnalysisDraft();
    setSaveErrorMessage(null);
    setSaveStatusMessage('Report saved. Check Flood prone areas page.');
  };

  useEffect(() => {
    isMountedRef.current = true;

    const hydrateFromDraft = () => {
      const existingDraft = readVideoAnalysisDraft();
      if (!existingDraft) {
        return;
      }

      if (existingDraft.videoFileName) {
        setVideoFileName(existingDraft.videoFileName);
      }

      if (existingDraft.status === 'processing') {
        setIsAnalyzingVideo(true);
        setAnalysisProgress(existingDraft.analysisProgress ?? 8);
        return;
      }

      if (existingDraft.status === 'ready' && existingDraft.payload) {
        const payload = existingDraft.payload;
        setVideoFileName(payload.videoFileName || existingDraft.videoFileName || 'Uploaded Video');
        setProcessedVideoUrl(payload.processedVideoUrl);
        setAnalysisResult(payload.analysisResult ? (payload.analysisResult as VideoAnalysisResult) : null);
        setBoundaryPointsTotal(payload.boundaryPointsTotal);
        setBoundaryPointsAveragePerFrame(payload.boundaryPointsAveragePerFrame);
        setFlowParticlesTotal(payload.flowParticlesTotal);
        setFlowParticlesAveragePerFrame(payload.flowParticlesAveragePerFrame);
        setFlowParticlesAverageSpeed(payload.flowParticlesAverageSpeed);
        setFlowFrameMetrics(payload.flowFrameMetrics as FlowFrameMetric[]);
        setFramePreviews(payload.framePreviews as FramePreview[]);
        setSelectedFrameIndex(0);
        setAnalysisProgress(100);
        setIsAnalyzingVideo(false);

        if (!payload.analysisResult) {
          setAnalysisError('Processed video is ready, but detailed frame analysis was not available for this run.');
        }
      }
    };

    hydrateFromDraft();

    const handleDraftCleared = () => {
      resetAnalysisState();
    };

    const handleDraftUpdated = () => {
      hydrateFromDraft();
    };

    window.addEventListener('video-analysis-draft-updated', handleDraftUpdated);
    window.addEventListener('video-analysis-draft-cleared', handleDraftCleared);

    return () => {
      isMountedRef.current = false;
      timelineRequestRef.current += 1;

      if (progressTimerRef.current !== null) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      window.removeEventListener('video-analysis-draft-updated', handleDraftUpdated);
      window.removeEventListener('video-analysis-draft-cleared', handleDraftCleared);
    };
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Flood Control Analysis</h1>
            <p className="text-gray-600">Import and analyze flood surveillance videos and monitor water levels</p>
          </div>
        </div>
      </div>

      {/* Video Upload Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Video Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadedVideo && !isAnalyzingVideo && !processedVideoUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isDragging ? 'Drop video here' : 'Drag and drop your video'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse from your computer
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Video File
                    </Button>
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Supported formats: MP4, AVI, MOV, MKV
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{videoFileName}</p>
                    <p className="text-sm text-gray-500">Video uploaded successfully</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveVideo}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploadedVideo ? (
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    src={uploadedVideo}
                    controls
                    className="w-full max-h-[600px]"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-sm text-blue-800">
                  {isAnalyzingVideo
                    ? `Processing ${videoFileName || 'uploaded video'} in the background...`
                    : 'Processed video is ready. Save it before discarding.'}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={handleAnalyzeVideo}
                  disabled={isAnalyzingVideo || !uploadedVideoFile}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {isAnalyzingVideo ? 'Analyzing Video...' : 'Analyze Video'}
                </Button>
                <Button variant="outline" onClick={handleRemoveVideo}>
                  Upload Different Video
                </Button>
              </div>

              {isAnalyzingVideo && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm text-blue-800">
                    <span>{analysisProgressLabel}</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}

              {processedVideoUrl && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-gray-900">Processed Video Preview</h3>
                  <p className="text-xs text-gray-500">
                    {isPreparingTimeline
                      ? 'Preparing frame timeline...'
                      : `Frames: ${framePreviews.length > 0 ? framePreviews.length : analysisResult?.frameTimeline.length ?? 0}`}
                  </p>
                </div>

                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={processedPreviewRef}
                    src={processedVideoUrl}
                    controls
                    className="w-full h-auto max-h-[600px]"
                    preload="metadata"
                    onTimeUpdate={(event) => setPreviewCurrentTime(event.currentTarget.currentTime)}
                    onLoadedMetadata={(event) => setPreviewCurrentTime(event.currentTarget.currentTime || 0)}
                  >
                    Your browser does not support the video tag.
                  </video>

                </div>

                {framePreviews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Frame {selectedFrameIndex + 1}</span>
                        <span>{framePreviews[selectedFrameIndex]?.timestampSeconds.toFixed(1)}s</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(framePreviews.length - 1, 0)}
                        value={selectedFrameIndex}
                        onChange={(event) => setSelectedFrameIndex(Number(event.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {framePreviews.map((frame, index) => (
                        <button
                          key={`preview-${frame.frame}`}
                          type="button"
                          onClick={() => setSelectedFrameIndex(index)}
                          className={`shrink-0 rounded-md border transition-all ${
                            selectedFrameIndex === index
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          title={`Frame ${frame.frame} at ${frame.timestampSeconds.toFixed(1)}s`}
                        >
                          <img
                            src={frame.imageUrl}
                            alt={`Frame ${frame.frame}`}
                            className="h-16 w-28 object-cover rounded-t-md"
                          />
                          <div className="px-2 py-1 text-[10px] text-gray-600 bg-gray-50 rounded-b-md text-left">
                            F{frame.frame} • {frame.timestampSeconds.toFixed(1)}s
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  analysisResult?.frameTimeline && analysisResult.frameTimeline.length > 0 ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Frame {analysisResult.frameTimeline[activeFrameIndex]?.frame ?? '-'}</span>
                          <span>
                            {analysisResult.frameTimeline[activeFrameIndex]
                              ? `${analysisResult.frameTimeline[activeFrameIndex].timestampSeconds.toFixed(1)}s`
                              : '-'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={Math.max(analysisResult.frameTimeline.length - 1, 0)}
                          value={activeFrameIndex}
                          onChange={(event) => {
                            const nextIndex = Number(event.target.value);
                            const nextFrame = analysisResult.frameTimeline[nextIndex];
                            const previewVideo = processedPreviewRef.current;

                            if (!nextFrame || !previewVideo) {
                              return;
                            }

                            previewVideo.currentTime = nextFrame.timestampSeconds;
                            previewVideo.pause();
                            setPreviewCurrentTime(nextFrame.timestampSeconds);
                          }}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {analysisResult.frameTimeline.map((frame, index) => (
                          <button
                            key={`timeline-fallback-${frame.frame}`}
                            type="button"
                            onClick={() => {
                              const previewVideo = processedPreviewRef.current;
                              if (!previewVideo) {
                                return;
                              }

                              previewVideo.currentTime = frame.timestampSeconds;
                              previewVideo.pause();
                              setPreviewCurrentTime(frame.timestampSeconds);
                            }}
                            className={`shrink-0 rounded-md border px-2 py-1 text-[10px] transition-all ${
                              activeFrameIndex === index
                                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 text-blue-800'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                            }`}
                            title={`Frame ${frame.frame} at ${frame.timestampSeconds.toFixed(1)}s`}
                          >
                            F{frame.frame} • {frame.timestampSeconds.toFixed(1)}s
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded border border-dashed border-gray-300 p-3 text-xs text-gray-500">
                      {isPreparingTimeline
                        ? 'Extracting frame previews from uploaded video...'
                        : 'No frame timeline data available for this processed video.'}
                    </div>
                  )
                )}

                {activeFrame && (
                  <div className="rounded-md border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 px-3 py-3 text-xs text-slate-800 space-y-4 shadow-sm">
                    <p className="font-semibold text-slate-900">
                      Dynamic Frame Report: F{activeFrame.frame} • {activeFrame.timestampSeconds.toFixed(1)}s
                    </p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      <div className="rounded border border-sky-300 bg-white px-3 py-3 space-y-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Trend (Frames)</p>
                        <ChartContainer config={dynamicReportChartConfig} className="h-40 w-full">
                          <LineChart data={dynamicChartWindow} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="frameLabel"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              minTickGap={16}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              width={44}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="line" />}
                            />
                            <Line
                              dataKey="boundaryPoints"
                              type="monotone"
                              stroke="var(--color-boundaryPoints)"
                              strokeWidth={2}
                              dot={{ r: 3, fill: 'var(--color-boundaryPoints)' }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ChartContainer>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary (This Frame)</p>
                            <p className="text-sm font-semibold text-slate-900">{activeFrame.boundaryPoints.toLocaleString()}</p>
                          </div>
                          <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Total</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {(boundaryPointsTotal ?? timelineBoundaryTotal).toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Avg / Frame</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDecimal(boundaryPointsAveragePerFrame ?? timelineBoundaryAverage)}
                            </p>
                          </div>
                          <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Peak</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {boundaryPeak !== null ? boundaryPeak.toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Low</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {boundaryLow !== null ? boundaryLow.toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Data Points</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {boundaryDataPoints.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded border border-lime-300 bg-white px-3 py-3 space-y-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Particles Trend (Frames)</p>
                        <ChartContainer config={flowReportChartConfig} className="h-44 w-full">
                          <LineChart data={flowChartWindow} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="frameLabel"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              minTickGap={16}
                            />
                            <YAxis
                              yAxisId="left"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              width={44}
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              width={44}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="line" />}
                            />
                            <Line
                              yAxisId="left"
                              dataKey="flowParticles"
                              type="monotone"
                              stroke="var(--color-flowParticles)"
                              strokeWidth={2}
                              dot={{ r: 3, fill: 'var(--color-flowParticles)' }}
                              activeDot={{ r: 5 }}
                            />
                            <Line
                              yAxisId="right"
                              dataKey="avgSpeed"
                              type="monotone"
                              stroke="var(--color-avgSpeed)"
                              strokeWidth={2}
                              strokeDasharray="4 3"
                              dot={{ r: 2.5, fill: 'var(--color-avgSpeed)' }}
                              activeDot={{ r: 4 }}
                            />
                          </LineChart>
                        </ChartContainer>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow (This Frame)</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {activeFlowMetric ? activeFlowMetric.flowParticles.toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Particles Total</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {flowParticlesTotal !== null ? flowParticlesTotal.toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Avg / Frame</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {flowParticlesAveragePerFrame !== null ? formatDecimal(flowParticlesAveragePerFrame) : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Speed (This Frame)</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {activeFlowMetric ? formatDecimal(activeFlowMetric.avgSpeed) : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Avg Speed</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {flowParticlesAverageSpeed !== null ? formatDecimal(flowParticlesAverageSpeed) : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Data Points</p>
                            <p className="text-sm font-semibold text-slate-900">{flowFrameMetrics.length.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded border border-indigo-200 bg-white px-3 py-3 space-y-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Water, Debris, and Turbidity</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="rounded border border-blue-200 bg-blue-50 px-2 py-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Water Level</p>
                          <Badge className="mt-1 bg-blue-600 text-white">{getWaterLevelLabel(activeFrame.waterLevel)}</Badge>
                        </div>
                        <div className="rounded border border-amber-200 bg-amber-50 px-2 py-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Debris</p>
                          <Badge className="mt-1 bg-amber-500 text-white">{getDebrisLabel(activeFrame.debris)}</Badge>
                        </div>
                        <div className="rounded border border-emerald-200 bg-emerald-50 px-2 py-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Turbidity</p>
                          <Badge className="mt-1 bg-emerald-600 text-white">{getTurbidityLabel(activeFrame.turbidity)}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {analysisResult && processedVideoUrl && (
                  <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-3 space-y-3">
                    <p className="text-sm font-semibold text-violet-900">Save Dynamic Frame Report + Processed Video Preview</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-violet-800">File name</p>
                        <Input
                          value={saveFileName}
                          onChange={(event) => setSaveFileName(event.target.value)}
                          placeholder="Enter report file name"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-violet-800">Address</p>
                        <Input
                          value={saveAddress}
                          onChange={(event) => setSaveAddress(event.target.value)}
                          placeholder="Enter location address"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-violet-800">Date taken</p>
                        <Input
                          type="date"
                          value={saveDateTaken}
                          onChange={(event) => setSaveDateTaken(event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        className="bg-violet-700 hover:bg-violet-800"
                        onClick={handleSaveReport}
                        disabled={!canSaveReport}
                      >
                        Save To Flood Prone Areas
                      </Button>
                      <p className="text-xs text-violet-700">
                        Saved content: Dynamic Frame Report ({activeFrame ? `F${activeFrame.frame} • ${activeFrame.timestampSeconds.toFixed(1)}s` : 'N/A'}) and Processed Video Preview.
                      </p>
                    </div>

                    {saveErrorMessage && <p className="text-xs text-red-700">{saveErrorMessage}</p>}
                    {saveStatusMessage && <p className="text-xs text-green-700">{saveStatusMessage}</p>}
                  </div>
                )}
                </div>
              )}

              {analysisError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{analysisError}</p>
                </div>
              )}
              
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}