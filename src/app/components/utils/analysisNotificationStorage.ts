export type AnalysisNotificationType = 'success' | 'info' | 'warning' | 'alert';

export interface AnalysisNotification {
  id: string;
  type: AnalysisNotificationType;
  title: string;
  description: string;
  fileName: string;
  processedAt: string;
  createdAt: string;
  unread: boolean;
}

const ANALYSIS_NOTIFICATION_STORAGE_KEY = 'analysis-video-notifications';
const ANALYSIS_NOTIFICATION_UPDATED_EVENT = 'analysis-notifications-updated';

const dispatchNotificationsUpdated = () => {
  window.dispatchEvent(new Event(ANALYSIS_NOTIFICATION_UPDATED_EVENT));
};

const readRaw = (): AnalysisNotification[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = localStorage.getItem(ANALYSIS_NOTIFICATION_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is AnalysisNotification => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        typeof item.fileName === 'string' &&
        typeof item.processedAt === 'string' &&
        typeof item.createdAt === 'string' &&
        typeof item.unread === 'boolean' &&
        typeof item.type === 'string'
      );
    });
  } catch {
    return [];
  }
};

const writeRaw = (notifications: AnalysisNotification[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ANALYSIS_NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  dispatchNotificationsUpdated();
};

export const getAnalysisNotificationUpdatedEvent = () => ANALYSIS_NOTIFICATION_UPDATED_EVENT;

export const readAnalysisNotifications = (): AnalysisNotification[] => {
  return readRaw().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const addVideoProcessedNotification = (fileName: string, processedAt = new Date().toISOString()) => {
  const safeFileName = fileName.trim() || 'Uploaded video';

  const notification: AnalysisNotification = {
    id: `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'success',
    title: 'Video processing completed',
    description: `${safeFileName} completed.`,
    fileName: safeFileName,
    processedAt,
    createdAt: new Date().toISOString(),
    unread: true,
  };

  const current = readRaw();
  writeRaw([notification, ...current].slice(0, 50));
};

export const markAnalysisNotificationAsRead = (id: string) => {
  const current = readRaw();
  const updated = current.map((notification) =>
    notification.id === id ? { ...notification, unread: false } : notification,
  );
  writeRaw(updated);
};

export const markAllAnalysisNotificationsAsRead = () => {
  const current = readRaw();
  const updated = current.map((notification) => ({ ...notification, unread: false }));
  writeRaw(updated);
};
