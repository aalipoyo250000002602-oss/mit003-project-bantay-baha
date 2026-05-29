import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Bell } from 'lucide-react';
import { getNotificationIcon } from '../utils/navigationUtils';
import {
  getAnalysisNotificationUpdatedEvent,
  markAllAnalysisNotificationsAsRead,
  markAnalysisNotificationAsRead,
  readAnalysisNotifications,
} from '../utils/analysisNotificationStorage';

interface NotificationDropdownProps {
  onNotificationClick?: (notificationId: string) => void;
}

export function NotificationDropdown({ onNotificationClick }: NotificationDropdownProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(readAnalysisNotifications());

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  useEffect(() => {
    const refreshNotifications = () => {
      setNotifications(readAnalysisNotifications());
    };

    refreshNotifications();
    const updateEvent = getAnalysisNotificationUpdatedEvent();
    window.addEventListener(updateEvent, refreshNotifications);

    return () => {
      window.removeEventListener(updateEvent, refreshNotifications);
    };
  }, []);

  const formatRelativeTime = (isoDate: string) => {
    const elapsedMs = Date.now() - new Date(isoDate).getTime();
    if (Number.isNaN(elapsedMs) || elapsedMs < 0) {
      return 'Just now';
    }

    const elapsedMinutes = Math.floor(elapsedMs / 60000);
    if (elapsedMinutes < 1) {
      return 'Just now';
    }
    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} min ago`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return `${elapsedHours} hr ago`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    return `${elapsedDays} day${elapsedDays > 1 ? 's' : ''} ago`;
  };

  const formatProcessedTime = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return 'Unknown time';
    }

    return date.toLocaleString([], {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNotificationClick = (notificationId: string) => {
    markAnalysisNotificationAsRead(notificationId);
    onNotificationClick?.(notificationId);
  };

  const markAllAsRead = () => {
    markAllAnalysisNotificationsAsRead();
  };

  return (
    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-popover border-border" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs hover:bg-accent hover:text-accent-foreground"
            >
              Mark all read
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No notifications yet. Completed video processing will appear here.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors ${
                  notification.unread ? 'bg-accent/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground text-sm">{notification.title}</h4>
                      {notification.unread && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Processed: {formatProcessedTime(notification.processedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}