import { apiClient } from './apiClient';

export interface ChatMessageRequest {
  message: string;
  session_id?: string;
}

export interface ChatMessageResponse {
  success: boolean;
  response: string;
  session_id: string;
  execution_time_ms?: number;
  error?: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  success: boolean;
  messages: ChatHistoryMessage[];
  session_id: string;
}

export interface NewSessionResponse {
  success: boolean;
  session_id: string;
}

export interface ChatSuggestionsResponse {
  success: boolean;
  suggestions: string[];
}

export interface ChatStatsResponse {
  success: boolean;
  stats: Record<string, any>;
  agent: 'react' | 'langgraph';
}

export interface FeedbackRequest {
  message_id: string;
  rating: 'up' | 'down';
  comment?: string;
}

const SESSION_STORAGE_KEY = 'vitalsync_chat_session';

class ChatApiService {
  async sendMessage(message: string, sessionId?: string): Promise<ChatMessageResponse> {
    return apiClient.post<ChatMessageResponse>('/chat/message', {
      message,
      session_id: sessionId,
    });
  }

  async createSession(): Promise<NewSessionResponse> {
    return apiClient.post<NewSessionResponse>('/chat/session/new');
  }

  async getHistory(sessionId: string): Promise<ChatHistoryResponse> {
    return apiClient.get<ChatHistoryResponse>(`/chat/history/${sessionId}`);
  }

  async endSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/chat/session/${sessionId}`);
  }

  async getSuggestions(): Promise<ChatSuggestionsResponse> {
    return apiClient.get<ChatSuggestionsResponse>('/chat/suggestions');
  }

  async getStats(): Promise<ChatStatsResponse> {
    return apiClient.get<ChatStatsResponse>('/chat/stats');
  }

  async submitFeedback(data: FeedbackRequest): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/chat/feedback', data);
  }

  // Session storage helpers
  getStoredSessionId(): string | null {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  }

  storeSessionId(sessionId: string): void {
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  clearStoredSession(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export const chatApiService = new ChatApiService();
