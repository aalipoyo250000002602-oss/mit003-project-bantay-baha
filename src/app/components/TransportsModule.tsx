import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import {
  readSavedFloodReports,
  updateSavedFloodReportFramePreviews,
  type SavedFloodAnalysisReport,
  type SavedReportFramePreview,
} from './utils/floodReportStorage';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  Waves,
  Search,
} from 'lucide-react';

const tripsData = [
  {
    id: 'TR001',
    route: { origin: 'New York, NY', destination: 'Boston, MA' },
    vehicle: { id: 'TRK-001', name: 'Volvo VNL 860', type: 'road' },
    driver: { name: 'Michael Johnson', id: 'D001', photo: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    customer: 'Acme Corp',
    material: { type: 'Electronics', weight: '15,000 lbs', quantity: '250 units' },
    status: 'Completed',
    startDate: '2024-01-08',
    endDate: '2024-01-10',
    estimatedDuration: '8h 30m',
    actualDuration: '8h 15m',
    distance: '215 miles',
    revenue: '$2,450',
    fuelCost: '$180',
    timeline: [
      { step: 'Trip Started', time: '2024-01-08 08:00', status: 'completed' },
      { step: 'Loaded Cargo', time: '2024-01-08 09:30', status: 'completed' },
      { step: 'En Route', time: '2024-01-08 10:00', status: 'completed' },
      { step: 'Delivered', time: '2024-01-08 18:15', status: 'completed' }
    ]
  },
  {
    id: 'TR002',
    route: { origin: 'Chicago, IL', destination: 'Miami, FL' },
    vehicle: { id: 'AIR-205', name: 'Boeing 737 Cargo', type: 'air' },
    driver: { name: 'Sarah Wilson', id: 'D002', photo: 'https://images.unsplash.com/photo-1622175691858-a4deb912838e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    customer: 'MedSupply Inc',
    material: { type: 'Medical Supplies', weight: '8,500 lbs', quantity: '150 boxes' },
    status: 'In Transit',
    startDate: '2024-01-12',
    endDate: '2024-01-12',
    estimatedDuration: '3h 45m',
    actualDuration: 'In Progress',
    distance: '1,197 miles',
    revenue: '$8,900',
    fuelCost: '$650',
    timeline: [
      { step: 'Trip Started', time: '2024-01-12 06:00', status: 'completed' },
      { step: 'Loaded Cargo', time: '2024-01-12 07:15', status: 'completed' },
      { step: 'En Route', time: '2024-01-12 08:00', status: 'current' },
      { step: 'Deliver', time: '2024-01-12 11:45', status: 'pending' }
    ]
  },
  {
    id: 'TR003',
    route: { origin: 'Seattle, WA', destination: 'Tokyo, Japan' },
    vehicle: { id: 'SEA-102', name: 'Container Ship Atlas', type: 'sea' },
    driver: { name: 'David Chen', id: 'D003', photo: 'https://images.unsplash.com/photo-1710242078536-fe62a305a86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    customer: 'Global Exports Ltd',
    material: { type: 'Machinery', weight: '45,000 lbs', quantity: '12 containers' },
    status: 'Loading',
    startDate: '2024-01-15',
    endDate: '2024-01-30',
    estimatedDuration: '15 days',
    actualDuration: 'Not Started',
    distance: '4,792 miles',
    revenue: '$15,600',
    fuelCost: '$2,100',
    timeline: [
      { step: 'Cargo Preparation', time: '2024-01-15 10:00', status: 'current' },
      { step: 'Loading', time: '2024-01-15 14:00', status: 'pending' },
      { step: 'Departure', time: '2024-01-16 08:00', status: 'pending' },
      { step: 'Arrive Tokyo', time: '2024-01-30 16:00', status: 'pending' }
    ]
  },
  {
    id: 'TR004',
    route: { origin: 'Dallas, TX', destination: 'Denver, CO' },
    vehicle: { id: 'TRK-089', name: 'Peterbilt 579', type: 'road' },
    driver: { name: 'Lisa Brown', id: 'D004', photo: 'https://images.unsplash.com/photo-1659353740059-5554fb2ac89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    customer: 'FastTrack Logistics',
    material: { type: 'Consumer Goods', weight: '12,000 lbs', quantity: '500 packages' },
    status: 'Scheduled',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    estimatedDuration: '12h 30m',
    actualDuration: 'Not Started',
    distance: '781 miles',
    revenue: '$1,890',
    fuelCost: '$210',
    timeline: [
      { step: 'Pre-Trip Check', time: '2024-01-20 06:00', status: 'pending' },
      { step: 'Load Cargo', time: '2024-01-20 07:00', status: 'pending' },
      { step: 'Depart', time: '2024-01-20 08:00', status: 'pending' },
      { step: 'Deliver', time: '2024-01-20 20:30', status: 'pending' }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'In Transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'Loading': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    case 'Scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const savedBoundaryChartConfig = {
  boundaryPoints: {
    label: 'Boundary Points',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const savedFlowChartConfig = {
  flowParticles: {
    label: 'Flow Particles',
    color: 'hsl(var(--chart-2))',
  },
  avgSpeed: {
    label: 'Avg Speed',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const mapWaterLevelLabelToValue = (value: string): 'low' | 'stable' | 'high' => {
  const normalized = value.toLowerCase();
  if (normalized.includes('danger')) {
    return 'high';
  }
  if (normalized.includes('stable')) {
    return 'stable';
  }
  return 'low';
};

const mapDebrisLabelToValue = (value: string): 'none' | 'minor' | 'detected' => {
  const normalized = value.toLowerCase();
  if (normalized.includes('detected') || normalized.includes('obstruction')) {
    return 'detected';
  }
  if (normalized.includes('minor')) {
    return 'minor';
  }
  return 'none';
};

const mapTurbidityLabelToValue = (value: string): 'clear' | 'murky' | 'turbid' => {
  const normalized = value.toLowerCase();
  if (normalized.includes('turbid') || normalized.includes('mud')) {
    return 'turbid';
  }
  if (normalized.includes('murky')) {
    return 'murky';
  }
  return 'clear';
};

interface TransportsModuleProps {
  onOpenCreateTrip?: () => void;
  onOpenRouteOptimization?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAlerts?: () => void;
  onOpenGenerateReport?: () => void;
  onNavigateToModule?: (module: string) => void;
}

export function TransportsModule({ 
  onOpenCreateTrip,
  onOpenGenerateReport 
}: TransportsModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedReports, setSavedReports] = useState<SavedFloodAnalysisReport[]>([]);
  const [savedReportFrameIndex, setSavedReportFrameIndex] = useState<Record<string, number>>({});
  const [expandedSavedReports, setExpandedSavedReports] = useState<Record<string, boolean>>({});
  const [derivedFramePreviews, setDerivedFramePreviews] = useState<Record<string, SavedReportFramePreview[]>>({});
  const [framePreviewLoading, setFramePreviewLoading] = useState<Record<string, boolean>>({});
  const savedReportVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const seekSavedReportVideo = (reportId: string, timestampSeconds: number) => {
    const player = savedReportVideoRefs.current[reportId];
    if (!player) {
      return;
    }

    const seek = () => {
      player.currentTime = Math.max(0, timestampSeconds);
      player.pause();
    };

    if (player.readyState >= 1) {
      seek();
      return;
    }

    player.addEventListener('loadedmetadata', seek, { once: true });
  };

  useEffect(() => {
    const refreshSavedReports = () => {
      setSavedReports(readSavedFloodReports());
    };

    refreshSavedReports();
    window.addEventListener('flood-report-saved', refreshSavedReports);
    window.addEventListener('storage', refreshSavedReports);

    return () => {
      window.removeEventListener('flood-report-saved', refreshSavedReports);
      window.removeEventListener('storage', refreshSavedReports);
    };
  }, []);

  const generateFramePreviewsFromVideo = async (videoUrl: string): Promise<SavedReportFramePreview[]> => {
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.src = videoUrl;

    const waitForVideoEvent = (eventName: 'loadedmetadata' | 'seeked') =>
      new Promise<void>((resolve, reject) => {
        const onReady = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error('Unable to generate frame snapshots for this report.'));
        };
        const cleanup = () => {
          videoElement.removeEventListener(eventName, onReady);
          videoElement.removeEventListener('error', onError);
        };

        videoElement.addEventListener(eventName, onReady, { once: true });
        videoElement.addEventListener('error', onError, { once: true });
      });

    await waitForVideoEvent('loadedmetadata');

    const duration = Number.isFinite(videoElement.duration) && videoElement.duration > 0
      ? videoElement.duration
      : 0;
    const frameSamples = duration > 0
      ? Math.min(24, Math.max(8, Math.floor(duration)))
      : 8;

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 126;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      return [];
    }

    const previews: SavedReportFramePreview[] = [];

    for (let sampleIndex = 0; sampleIndex < frameSamples; sampleIndex += 1) {
      if (duration > 0) {
        const timestamp = ((sampleIndex + 1) * duration) / (frameSamples + 1);
        videoElement.currentTime = timestamp;
        await waitForVideoEvent('seeked');
      }

      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      previews.push({
        frame: sampleIndex + 1,
        timestampSeconds: duration > 0 ? ((sampleIndex + 1) * duration) / (frameSamples + 1) : sampleIndex,
        imageUrl: canvas.toDataURL('image/jpeg', 0.72),
      });
    }

    return previews;
  };

  useEffect(() => {
    const expandedReportIds = Object.entries(expandedSavedReports)
      .filter(([, isExpanded]) => isExpanded)
      .map(([reportId]) => reportId);

    expandedReportIds.forEach((reportId) => {
      const report = savedReports.find((item) => item.id === reportId);
      if (!report) {
        return;
      }

      const existingPreviews = report.framePreviews && report.framePreviews.length > 0
        ? report.framePreviews
        : derivedFramePreviews[reportId];

      if (existingPreviews && existingPreviews.length > 0) {
        return;
      }

      if (framePreviewLoading[reportId]) {
        return;
      }

      setFramePreviewLoading((prev) => ({
        ...prev,
        [reportId]: true,
      }));

      void generateFramePreviewsFromVideo(report.processedVideoUrl)
        .then((previews) => {
          if (!previews.length) {
            return;
          }

          setDerivedFramePreviews((prev) => ({
            ...prev,
            [reportId]: previews,
          }));

          updateSavedFloodReportFramePreviews(reportId, previews);
          window.dispatchEvent(new Event('flood-report-saved'));
        })
        .catch(() => {
          // Keep fallback frame chips when snapshot generation is unavailable.
        })
        .finally(() => {
          setFramePreviewLoading((prev) => ({
            ...prev,
            [reportId]: false,
          }));
        });
    });
  }, [expandedSavedReports, savedReports, derivedFramePreviews, framePreviewLoading]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredSavedReports = savedReports.filter((report) => {
    const matchesText =
      normalizedSearch.length === 0 ||
      report.fileName.toLowerCase().includes(normalizedSearch) ||
      report.address.toLowerCase().includes(normalizedSearch);
    return matchesText;
  });

  return (
    <div className="p-6 space-y-4 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Review saved flood video analysis reports</p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by file name or address..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-3">
          {filteredSavedReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matching saved reports. Try another file name or address.
            </p>
          ) : (
            filteredSavedReports.map((report) => {
              const fallbackFrameNumber = Number.parseInt(report.frameLabel.replace(/[^0-9]/g, ''), 10) || 1;
              const frameTimeline = report.frameTimeline && report.frameTimeline.length > 0
                ? report.frameTimeline
                : [
                    {
                      frame: fallbackFrameNumber,
                      timestampSeconds: report.frameTimestampSeconds,
                      waterLevel: mapWaterLevelLabelToValue(report.waterLevelTrend),
                      debris: mapDebrisLabelToValue(report.debrisBlockages),
                      turbidity: mapTurbidityLabelToValue(report.waterTurbidity),
                      boundaryPoints: report.boundaryPointsThisFrame,
                    },
                  ];

              const flowTimeline = report.flowFrameMetrics && report.flowFrameMetrics.length > 0
                ? report.flowFrameMetrics
                : report.flowParticlesThisFrame !== null || report.flowSpeedThisFrame !== null
                  ? [
                      {
                        frame: frameTimeline[0].frame,
                        flowParticles: report.flowParticlesThisFrame ?? 0,
                        avgSpeed: report.flowSpeedThisFrame ?? 0,
                      },
                    ]
                  : [];
              const framePreviews = report.framePreviews && report.framePreviews.length > 0
                ? report.framePreviews
                : derivedFramePreviews[report.id] ?? [];
              const maxFrameIndex = Math.max(frameTimeline.length - 1, 0);
              const currentFrameIndex = Math.min(savedReportFrameIndex[report.id] ?? 0, maxFrameIndex);
              const currentFrame = frameTimeline[currentFrameIndex] ?? null;
              const currentFlowMetric = flowTimeline.find((item) => item.frame === currentFrame?.frame) ?? null;
              const isExpanded = expandedSavedReports[report.id] ?? false;

              const boundaryChartData = frameTimeline.map((item) => ({
                frameLabel: `F${item.frame}`,
                boundaryPoints: item.boundaryPoints,
              }));
              const boundaryValues = frameTimeline.map((item) => item.boundaryPoints);
              const boundaryPeak = boundaryValues.length > 0 ? Math.max(...boundaryValues) : null;
              const boundaryLow = boundaryValues.length > 0 ? Math.min(...boundaryValues) : null;
              const boundaryDataPoints = boundaryValues.length;

              const flowChartData = flowTimeline.map((item) => ({
                frameLabel: `F${item.frame}`,
                flowParticles: item.flowParticles,
                avgSpeed: item.avgSpeed,
              }));

              return (
                <div key={report.id} className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-3">
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div className="space-y-2 min-w-0">
                        <p className="font-semibold text-slate-900 break-words">{report.fileName}</p>
                        <p className="text-xs text-slate-700">
                          Address: {report.address}
                          <span className="mx-2">|</span>
                          Date taken: {report.dateTaken}
                          <span className="mx-2">|</span>
                          Saved: {new Date(report.savedAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <a
                          href={report.processedVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 items-center rounded-md border border-slate-300 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Open Processed Video Preview
                        </a>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            setExpandedSavedReports((prev) => ({
                              ...prev,
                              [report.id]: !isExpanded,
                            }));
                          }}
                        >
                          {isExpanded ? 'Expand Less' : 'Expand More'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-700">Processed Video Preview</p>
                    <div className="bg-black rounded-lg overflow-hidden border border-slate-300">
                      <video
                        ref={(element) => {
                          savedReportVideoRefs.current[report.id] = element;
                        }}
                        src={report.processedVideoUrl}
                        controls
                        preload="metadata"
                        className="w-full max-h-[420px]"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {isExpanded && frameTimeline.length > 0 && (
                    <div className="space-y-3">
                      {framePreviewLoading[report.id] && framePreviews.length === 0 && (
                        <div className="rounded border border-dashed border-gray-300 p-3 text-xs text-gray-500">
                          Preparing frame snapshots...
                        </div>
                      )}

                      {framePreviews.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {framePreviews.map((framePreview, previewIndex) => {
                            const matchingTimelineIndex = frameTimeline.findIndex(
                              (item) => item.frame === framePreview.frame,
                            );
                            const timelineIndex = matchingTimelineIndex >= 0
                              ? matchingTimelineIndex
                              : Math.min(previewIndex, maxFrameIndex);
                            const isActive = currentFrameIndex === timelineIndex;
                            return (
                              <button
                                key={`saved-preview-${report.id}-${framePreview.frame}-${previewIndex}`}
                                type="button"
                                onClick={() => {
                                  setSavedReportFrameIndex((prev) => ({
                                    ...prev,
                                    [report.id]: timelineIndex,
                                  }));
                                  seekSavedReportVideo(report.id, framePreview.timestampSeconds);
                                }}
                                className={`shrink-0 rounded-md border transition-all ${
                                  isActive
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                                title={`Frame ${framePreview.frame} at ${framePreview.timestampSeconds.toFixed(1)}s`}
                              >
                                <img
                                  src={framePreview.imageUrl}
                                  alt={`Frame ${framePreview.frame}`}
                                  className="h-16 w-28 object-cover rounded-t-md"
                                />
                                <div className="px-2 py-1 text-[10px] text-gray-600 bg-gray-50 rounded-b-md text-left">
                                  F{framePreview.frame} • {framePreview.timestampSeconds.toFixed(1)}s
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 pb-1">
                          {frameTimeline.map((item, index) => (
                            <button
                              key={`saved-frame-${report.id}-${item.frame}`}
                              type="button"
                              onClick={() => {
                                setSavedReportFrameIndex((prev) => ({
                                  ...prev,
                                  [report.id]: index,
                                }));
                                seekSavedReportVideo(report.id, item.timestampSeconds);
                              }}
                              className={`shrink-0 rounded-md border px-2 py-1 text-[10px] transition-all ${
                                currentFrameIndex === index
                                  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 text-blue-800'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                              }`}
                              title={`Frame ${item.frame} at ${item.timestampSeconds.toFixed(1)}s`}
                            >
                              F{item.frame} • {item.timestampSeconds.toFixed(1)}s
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>Frame {currentFrame ? currentFrame.frame : '-'}</span>
                          <span>{currentFrame ? `${currentFrame.timestampSeconds.toFixed(1)}s` : '-'}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={maxFrameIndex}
                          value={currentFrameIndex}
                          onChange={(event) => {
                            const nextIndex = Number(event.target.value);
                            const nextFrame = frameTimeline[nextIndex];

                            setSavedReportFrameIndex((prev) => ({
                              ...prev,
                              [report.id]: nextIndex,
                            }));

                            if (nextFrame) {
                              seekSavedReportVideo(report.id, nextFrame.timestampSeconds);
                            }
                          }}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div className="rounded-md border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 px-3 py-3 text-xs text-slate-800 space-y-4 shadow-sm">
                        <p className="font-semibold text-slate-900">
                          Dynamic Frame Report: {currentFrame ? `F${currentFrame.frame} • ${currentFrame.timestampSeconds.toFixed(1)}s` : `${report.frameLabel} • ${report.frameTimestampSeconds.toFixed(1)}s`}
                        </p>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          <div className="rounded border border-sky-300 bg-white px-3 py-3 space-y-3">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Trend (Frames)</p>
                            <ChartContainer config={savedBoundaryChartConfig} className="h-40 w-full">
                              <LineChart data={boundaryChartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="frameLabel" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={44} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
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
                                <p className="text-sm font-semibold text-slate-900">{currentFrame ? currentFrame.boundaryPoints.toLocaleString() : report.boundaryPointsThisFrame.toLocaleString()}</p>
                              </div>
                              <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Total</p>
                                <p className="text-sm font-semibold text-slate-900">{report.boundaryPointsTotal.toLocaleString()}</p>
                              </div>
                              <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Avg / Frame</p>
                                <p className="text-sm font-semibold text-slate-900">{report.boundaryAveragePerFrame.toFixed(2)}</p>
                              </div>
                              <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Peak</p>
                                <p className="text-sm font-semibold text-slate-900">{boundaryPeak !== null ? boundaryPeak.toLocaleString() : 'N/A'}</p>
                              </div>
                              <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Low</p>
                                <p className="text-sm font-semibold text-slate-900">{boundaryLow !== null ? boundaryLow.toLocaleString() : 'N/A'}</p>
                              </div>
                              <div className="rounded border border-sky-200 bg-sky-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Boundary Data Points</p>
                                <p className="text-sm font-semibold text-slate-900">{boundaryDataPoints.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded border border-lime-300 bg-white px-3 py-3 space-y-3">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Particles Trend (Frames)</p>
                            <ChartContainer config={savedFlowChartConfig} className="h-44 w-full">
                              <LineChart data={flowChartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="frameLabel" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
                                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} width={44} />
                                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} width={44} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
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
                                <p className="text-sm font-semibold text-slate-900">{currentFlowMetric ? currentFlowMetric.flowParticles.toLocaleString() : (report.flowParticlesThisFrame ?? 'N/A')}</p>
                              </div>
                              <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Particles Total</p>
                                <p className="text-sm font-semibold text-slate-900">{report.flowParticlesTotal ?? 'N/A'}</p>
                              </div>
                              <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Avg / Frame</p>
                                <p className="text-sm font-semibold text-slate-900">{report.flowAveragePerFrame !== null ? report.flowAveragePerFrame.toFixed(2) : 'N/A'}</p>
                              </div>
                              <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Speed (This Frame)</p>
                                <p className="text-sm font-semibold text-slate-900">{currentFlowMetric ? currentFlowMetric.avgSpeed.toFixed(2) : (report.flowSpeedThisFrame !== null ? report.flowSpeedThisFrame.toFixed(2) : 'N/A')}</p>
                              </div>
                              <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Avg Speed</p>
                                <p className="text-sm font-semibold text-slate-900">{report.flowAverageSpeed !== null ? report.flowAverageSpeed.toFixed(2) : 'N/A'}</p>
                              </div>
                              <div className="rounded border border-lime-200 bg-lime-50 px-2 py-2">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Flow Data Points</p>
                                <p className="text-sm font-semibold text-slate-900">{report.flowDataPoints.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded border border-indigo-200 bg-white px-3 py-3 space-y-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Water, Debris, and Turbidity</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="rounded border border-blue-200 bg-blue-50 px-2 py-2">
                              <p className="text-[10px] uppercase tracking-wide text-slate-500">Water Level</p>
                              <Badge className="mt-1 bg-blue-600 text-white">{currentFrame ? (currentFrame.waterLevel === 'high' ? 'Dangerously high' : currentFrame.waterLevel === 'stable' ? 'Stable' : 'Low') : report.waterLevelTrend}</Badge>
                            </div>
                            <div className="rounded border border-amber-200 bg-amber-50 px-2 py-2">
                              <p className="text-[10px] uppercase tracking-wide text-slate-500">Debris</p>
                              <Badge className="mt-1 bg-amber-500 text-white">{currentFrame ? (currentFrame.debris === 'detected' ? 'Visible debris/obstructions detected' : currentFrame.debris === 'minor' ? 'Minor floating debris observed' : 'None') : report.debrisBlockages}</Badge>
                            </div>
                            <div className="rounded border border-emerald-200 bg-emerald-50 px-2 py-2">
                              <p className="text-[10px] uppercase tracking-wide text-slate-500">Turbidity</p>
                              <Badge className="mt-1 bg-emerald-600 text-white">{currentFrame ? (currentFrame.turbidity === 'turbid' ? 'Heavily mud-colored (turbid)' : currentFrame.turbidity === 'murky' ? 'Murky' : 'Clear') : report.waterTurbidity}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </CardContent>
      </Card>

    </div>
  );
}