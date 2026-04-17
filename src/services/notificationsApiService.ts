import { apiClient } from './apiClient';

export interface BackendNotification {
  id: string;
  title: string;
  body: string;
  notification_type: string;
  source: string;
  action_url?: string;
  is_read: boolean;
  is_push_sent: boolean;
  created_at: string;
}

export interface GetNotificationsParams {
  unread_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkReadRequest {
  notification_ids?: string[];
}

export interface PushSubscribeRequest {
  fcm_token: string;
  device_name?: string;
  platform?: 'ios' | 'android' | 'web';
}

export interface PushSubscribeResponse {
  success: boolean;
  subscription_id: string;
}

const FCM_TOKEN_STORAGE_KEY = 'vitalsync_fcm_token';

class NotificationsApiService {
  async getNotifications(params?: GetNotificationsParams): Promise<BackendNotification[]> {
    return apiClient.get<BackendNotification[]>('/notifications', params);
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiClient.get<UnreadCountResponse>('/notifications/unread-count');
  }

  async markRead(notificationIds?: string[]): Promise<{ marked_read: number }> {
    return apiClient.post<{ marked_read: number }>('/notifications/mark-read', {
      notification_ids: notificationIds ?? null,
    });
  }

  async subscribePush(data: PushSubscribeRequest): Promise<PushSubscribeResponse> {
    return apiClient.post<PushSubscribeResponse>('/notifications/push-subscribe', data);
  }

  async unsubscribePush(fcmToken: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/notifications/push-unsubscribe', {
      fcm_token: fcmToken,
    });
  }

  // FCM token storage helpers
  getStoredFCMToken(): string | null {
    return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  }

  storeFCMToken(token: string): void {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
  }

  clearFCMToken(): void {
    localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
  }
}

export const notificationsApiService = new NotificationsApiService();
