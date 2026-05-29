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

const normalizeProcessedVideoUrl = (url: string) => {
  if (!url) {
    return url;
  }

  if (url.startsWith('/uploads/')) {
    // GitHub Pages is hosted under /<repo>, so keep uploads paths relative.
    return `./uploads/${url.slice('/uploads/'.length)}`;
  }

  return url;
};

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
    processedVideoUrl: normalizeProcessedVideoUrl(payload.processedVideoUrl),
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

export type UploadManifestItem = {
  fileName: string;
  modifiedAt: string;
  kind: 'processed-web' | 'processed' | 'uploaded';
  url: string;
};

export const syncSavedFloodReportsFromUploads = (
  uploadItems: UploadManifestItem[],
): SavedFloodAnalysisReport[] => {
  const existing = readSavedFloodReports();
  const existingByVideoUrl = new Set(existing.map((report) => normalizeProcessedVideoUrl(report.processedVideoUrl)));

  const candidates = uploadItems
    .filter((item) => item.kind === 'processed-web' || item.kind === 'processed')
    .map((item) => ({
      fileName: item.fileName,
      processedVideoUrl: normalizeProcessedVideoUrl(item.url),
      modifiedAt: item.modifiedAt,
    }))
    .filter((item) => !existingByVideoUrl.has(item.processedVideoUrl));

  if (candidates.length === 0) {
    return existing;
  }

  const importedReports: SavedFloodAnalysisReport[] = candidates.map((item) => ({
    id: crypto.randomUUID(),
    fileName: item.fileName,
    address: 'Imported from existing uploads',
    dateTaken: item.modifiedAt.slice(0, 10),
    savedAt: item.modifiedAt,
    videoOriginalName: item.fileName,
    processedVideoUrl: item.processedVideoUrl,
    frameLabel: 'F1',
    frameTimestampSeconds: 0,
    framePreviewImageUrl: '',
    waterLevelTrend: 'Unknown',
    debrisBlockages: 'Unknown',
    waterTurbidity: 'Unknown',
    boundaryPointsThisFrame: 0,
    boundaryPointsTotal: 0,
    boundaryAveragePerFrame: 0,
    flowParticlesThisFrame: null,
    flowParticlesTotal: null,
    flowAveragePerFrame: null,
    flowSpeedThisFrame: null,
    flowAverageSpeed: null,
    flowDataPoints: 0,
    frameTimeline: [
      {
        frame: 1,
        timestampSeconds: 0,
        waterLevel: 'stable',
        debris: 'none',
        turbidity: 'clear',
        boundaryPoints: 0,
      },
    ],
    flowFrameMetrics: [],
    framePreviews: [],
  }));

  const next = [...importedReports, ...existing].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return next;
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
