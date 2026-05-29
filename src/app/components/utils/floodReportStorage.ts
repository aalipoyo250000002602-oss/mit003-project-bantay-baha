export type SavedReportFrameTimelineItem = {
  frame: number;
  timestampSeconds: number;
  waterLevel: 'low' | 'stable' | 'high';
  debris: 'none' | 'minor' | 'detected';
  turbidity: 'clear' | 'murky' | 'turbid';
  boundaryPoints: number;
};

export type SavedReportFlowFrameMetric = {
  frame: number;
  flowParticles: number;
  avgSpeed: number;
};

export type SavedReportFramePreview = {
  frame: number;
  timestampSeconds: number;
  imageUrl: string;
};

export type SavedFloodAnalysisReport = {
  id: string;
  fileName: string;
  address: string;
  dateTaken: string;
  savedAt: string;
  videoOriginalName: string;
  processedVideoUrl: string;
  frameLabel: string;
  frameTimestampSeconds: number;
  framePreviewImageUrl: string;
  waterLevelTrend: string;
  debrisBlockages: string;
  waterTurbidity: string;
  boundaryPointsThisFrame: number;
  boundaryPointsTotal: number;
  boundaryAveragePerFrame: number;
  flowParticlesThisFrame: number | null;
  flowParticlesTotal: number | null;
  flowAveragePerFrame: number | null;
  flowSpeedThisFrame: number | null;
  flowAverageSpeed: number | null;
  flowDataPoints: number;
  frameTimeline?: SavedReportFrameTimelineItem[];
  flowFrameMetrics?: SavedReportFlowFrameMetric[];
  framePreviews?: SavedReportFramePreview[];
};

type SaveFloodAnalysisPayload = Omit<SavedFloodAnalysisReport, 'id' | 'savedAt'>;

const STORAGE_KEY = 'bantayBaha.savedFloodReports';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readSavedFloodReports = (): SavedFloodAnalysisReport[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as SavedFloodAnalysisReport[];
  } catch {
    return [];
  }
};

export const saveFloodAnalysisReport = (payload: SaveFloodAnalysisPayload): SavedFloodAnalysisReport => {
  const report: SavedFloodAnalysisReport = {
    ...payload,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };

  const existing = readSavedFloodReports();
  const next = [report, ...existing];

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return report;
};

export const updateSavedFloodReportFramePreviews = (
  reportId: string,
  framePreviews: SavedReportFramePreview[],
): SavedFloodAnalysisReport | null => {
  const existing = readSavedFloodReports();
  const reportIndex = existing.findIndex((report) => report.id === reportId);

  if (reportIndex < 0) {
    return null;
  }

  const updatedReport: SavedFloodAnalysisReport = {
    ...existing[reportIndex],
    framePreviews,
  };

  const next = [...existing];
  next[reportIndex] = updatedReport;

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return updatedReport;
};
