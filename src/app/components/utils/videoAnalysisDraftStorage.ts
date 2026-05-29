export type VideoAnalysisDraftStatus = 'processing' | 'ready';

export type VideoAnalysisDraftPayload = {
  videoFileName: string;
  processedVideoUrl: string;
  analysisResult: unknown | null;
  boundaryPointsTotal: number | null;
  boundaryPointsAveragePerFrame: number | null;
  flowParticlesTotal: number | null;
  flowParticlesAveragePerFrame: number | null;
  flowParticlesAverageSpeed: number | null;
  flowFrameMetrics: unknown[];
  framePreviews: unknown[];
};

export type VideoAnalysisDraft = {
  status: VideoAnalysisDraftStatus;
  updatedAt: string;
  videoFileName?: string;
  analysisProgress?: number;
  payload?: VideoAnalysisDraftPayload;
};

const STORAGE_KEY = 'bantayBaha.videoAnalysisDraft';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readVideoAnalysisDraft = (): VideoAnalysisDraft | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed as VideoAnalysisDraft;
  } catch {
    return null;
  }
};

export const writeVideoAnalysisDraft = (draft: VideoAnalysisDraft): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  window.dispatchEvent(new Event('video-analysis-draft-updated'));
};

export const clearVideoAnalysisDraft = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('video-analysis-draft-cleared'));
};
