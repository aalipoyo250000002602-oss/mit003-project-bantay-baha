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

const STORAGE_KEY = 'bantayBaha.savedFloodReports.v3';
const MAX_REPORTS = 150;

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

const createImportedReport = (input: {
  id: string;
  fileName: string;
  modifiedAt: string;
  processedVideoUrl: string;
}): SavedFloodAnalysisReport => ({
  id: input.id,
  fileName: input.fileName,
  address: 'Imported from existing uploads',
  dateTaken: input.modifiedAt.slice(0, 10),
  savedAt: input.modifiedAt,
  videoOriginalName: input.fileName,
  processedVideoUrl: normalizeProcessedVideoUrl(input.processedVideoUrl),
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
});

const HARD_CODED_EXISTING_REPORTS: SavedFloodAnalysisReport[] = [];

const mergeReportsByVideoUrl = (...groups: SavedFloodAnalysisReport[][]): SavedFloodAnalysisReport[] => {
  const merged = new Map<string, SavedFloodAnalysisReport>();

  for (const group of groups) {
    for (const report of group) {
      const normalizedUrl = normalizeProcessedVideoUrl(report.processedVideoUrl);
      if (!merged.has(normalizedUrl)) {
        merged.set(normalizedUrl, {
          ...report,
          processedVideoUrl: normalizedUrl,
        });
      }
    }
  }

  return [...merged.values()].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
};

const compactReportForStorage = (report: SavedFloodAnalysisReport): SavedFloodAnalysisReport => {
  // Frame preview data URLs are large and can exceed localStorage limits.
  return {
    ...report,
    framePreviewImageUrl: '',
    framePreviews: [],
  };
};

const writeSavedFloodReports = (reports: SavedFloodAnalysisReport[]) => {
  if (!isBrowser()) {
    return;
  }

  const boundedReports = reports.slice(0, MAX_REPORTS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boundedReports));
    return;
  } catch {
    // Retry with compacted payload when quota is exceeded.
  }

  const compactedReports = boundedReports.map((report) => compactReportForStorage(report));

  // If storage is still tight, keep trimming oldest reports until write succeeds.
  for (let keep = compactedReports.length; keep >= 1; keep -= 1) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compactedReports.slice(0, keep)));
      return;
    } catch {
      // continue trimming
    }
  }
};

export const readSavedFloodReports = (): SavedFloodAnalysisReport[] => {
  if (!isBrowser()) {
    return HARD_CODED_EXISTING_REPORTS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return HARD_CODED_EXISTING_REPORTS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return HARD_CODED_EXISTING_REPORTS;
    }

    return mergeReportsByVideoUrl(parsed as SavedFloodAnalysisReport[], HARD_CODED_EXISTING_REPORTS);
  } catch {
    return HARD_CODED_EXISTING_REPORTS;
  }
};

export const saveFloodAnalysisReport = (payload: SaveFloodAnalysisPayload): SavedFloodAnalysisReport => {
  const report: SavedFloodAnalysisReport = {
    ...payload,
    processedVideoUrl: normalizeProcessedVideoUrl(payload.processedVideoUrl),
    framePreviewImageUrl: '',
    framePreviews: [],
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };

  const existing = readSavedFloodReports();
  const next = [report, ...existing];

  writeSavedFloodReports(next);

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

  const importedReports: SavedFloodAnalysisReport[] = candidates.map((item) =>
    createImportedReport({
      id: crypto.randomUUID(),
      fileName: item.fileName,
      modifiedAt: item.modifiedAt,
      processedVideoUrl: item.processedVideoUrl,
    }),
  );

  const next = mergeReportsByVideoUrl(importedReports, existing, HARD_CODED_EXISTING_REPORTS);

  writeSavedFloodReports(next);

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
    // Keep previews in memory and avoid persisting heavy base64 blobs.
    framePreviews: framePreviews.slice(0, 0),
  };

  const next = [...existing];
  next[reportIndex] = updatedReport;

  writeSavedFloodReports(next);

  return updatedReport;
};
