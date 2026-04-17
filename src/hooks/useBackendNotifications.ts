import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsApiService, BackendNotification } from '../services/notificationsApiService';
import { getFCMToken, onMessage, messaging } from '../firebase';

const POLL_INTERVAL_MS = 60 * 1000; // 60 seconds

export function useBackendNotifications(isAuthenticated: boolean) {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await notificationsApiService.getNotifications({ limit: 20 });
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const { unread_count } = await notificationsApiService.getUnreadCount();
      setUnreadCount(unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  const markAsRead = useCallback(async (ids?: string[]) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(n =>
          !ids || ids.includes(n.id) ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => {
        if (!ids) return 0;
        return Math.max(0, prev - ids.length);
      });

      await notificationsApiService.markRead(ids);
      // Sync accurate count from server
      await refreshUnreadCount();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      // Revert on failure
      await fetchNotifications();
      await refreshUnreadCount();
    }
  }, [fetchNotifications, refreshUnreadCount]);

  const markAllRead = useCallback(async () => {
    await markAsRead(undefined);
  }, [markAsRead]);

  const registerPushToken = useCallback(async () => {
    try {
      // Skip if already registered this session
      const existing = notificationsApiService.getStoredFCMToken();
      if (existing) return;

      const token = await getFCMToken();
      if (!token) return;

      await notificationsApiService.subscribePush({
        fcm_token: token,
        platform: 'web',
      });

      notificationsApiService.storeFCMToken(token);
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();
    refreshUnreadCount();
    registerPushToken();

    pollRef.current = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isAuthenticated, fetchNotifications, refreshUnreadCount, registerPushToken]);

  // Foreground FCM push messages
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const { notification, data } = payload;
      if (!notification) return;

      const newNotification: BackendNotification = {
        id: data?.notification_id ?? `fcm-${Date.now()}`,
        title: notification.title ?? '',
        body: notification.body ?? '',
        notification_type: data?.notification_type ?? 'general',
        source: data?.source ?? 'push',
        action_url: data?.action_url,
        is_read: false,
        is_push_sent: true,
        created_at: new Date().toISOString(),
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [isAuthenticated]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllRead,
    registerPushToken,
  };
}
