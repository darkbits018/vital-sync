import { apiClient, PaginatedResponse } from './apiClient';

// Friend-related interfaces
export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  friends_since: string;
  friend_name: string;
  friend_email: string;
  friend_avatar_url?: string;
  is_achievements_public: boolean;
  status: 'online' | 'offline';
  mutual_friends_count: number;
}

export interface GetFriendsResponse {
  friends: Friend[];
  total: number;
  has_more: boolean;
}

export interface SendFriendRequestRequest {
  receiver_id: string;
  message?: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender_name: string;
  receiver_name: string;
}

export interface FriendRequestResponse {
  message: string;
  friendship_created?: boolean;
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  is_achievements_public: boolean;
  mutual_friends_count: number;
  is_friend: boolean;
  has_pending_request: boolean;
}

export interface SearchUsersResponse {
  users: UserSearchResult[];
  total: number;
}

export interface QRCodeResponse {
  qr_code_data: string;
  expires_at: string;
}

// Group-related interfaces
export interface Group {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  is_public: boolean;
  max_members: number;
  image_url?: string;
  invite_code: string;
  created_at: string;
  creator_name: string;
  member_count: number;
  user_role: 'admin' | 'member';
}

export interface GetGroupsResponse {
  groups: Group[];
  total: number;
  has_more: boolean;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  is_public?: boolean;
  max_members?: number;
  image_url?: string;
}

export interface JoinGroupRequest {
  invite_code?: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'meal_share' | 'workout_share' | 'system';
  metadata?: any;
  created_at: string;
  sender_name: string;
  sender_avatar_url?: string;
}

export interface GetGroupMessagesResponse {
  messages: GroupMessage[];
  total: number;
  has_more: boolean;
}

export interface SendGroupMessageRequest {
  content: string;
  message_type?: 'text';
  metadata?: any;
}

export interface ShareMealInGroupRequest {
  meal_id: string;
  message?: string;
}

export interface ShareWorkoutInGroupRequest {
  workout_id: string;
  message?: string;
}

export class SocialApiService {
  // Friends Management
  
  /**
   * Get user's friends list
   */
  async getFriends(params?: {
    limit?: number;
    offset?: number;
  }): Promise<GetFriendsResponse> {
    return apiClient.get<GetFriendsResponse>('/social/friends', params);
  }

  /**
   * Send friend request
   */
  async sendFriendRequest(data: SendFriendRequestRequest): Promise<FriendRequest> {
    return apiClient.post<FriendRequest>('/social/friends/request', data);
  }

  /**
   * Accept friend request
   */
  async acceptFriendRequest(requestId: string): Promise<FriendRequestResponse> {
    return apiClient.put<FriendRequestResponse>(`/social/friends/request/${requestId}/accept`);
  }

  /**
   * Decline friend request
   */
  async declineFriendRequest(requestId: string): Promise<FriendRequestResponse> {
    return apiClient.put<FriendRequestResponse>(`/social/friends/request/${requestId}/decline`);
  }

  /**
   * Remove friend
   */
  async removeFriend(friendId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/social/friends/${friendId}`);
  }

  /**
   * Get friend requests (sent and received)
   */
  async getFriendRequests(params?: {
    status?: 'pending' | 'accepted' | 'declined';
    type?: 'sent' | 'received';
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<FriendRequest>> {
    const response = await apiClient.get<{
      friend_requests: FriendRequest[];
      total: number;
      has_more: boolean;
    }>('/social/friends/requests', params);
    
    return {
      data: response.friend_requests,
      total: response.total,
      has_more: response.has_more,
    };
  }

  /**
   * Search users to add as friends
   */
  async searchUsers(query: string, limit: number = 20): Promise<SearchUsersResponse> {
    return apiClient.get<SearchUsersResponse>('/social/friends/search', { query, limit });
  }

  /**
   * Generate QR code for adding friends
   */
  async generateQRCode(): Promise<QRCodeResponse> {
    return apiClient.post<QRCodeResponse>('/social/friends/qr-code');
  }

  // Groups Management

  /**
   * Get user's groups
   */
  async getGroups(params?: {
    limit?: number;
    offset?: number;
  }): Promise<GetGroupsResponse> {
    return apiClient.get<GetGroupsResponse>('/social/groups', params);
  }

  /**
   * Create new group
   */
  async createGroup(data: CreateGroupRequest): Promise<Group> {
    return apiClient.post<Group>('/social/groups', data);
  }

  /**
   * Join group
   */
  async joinGroup(groupId: string, data?: JoinGroupRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/social/groups/${groupId}/join`, data);
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/social/groups/${groupId}/leave`);
  }

  /**
   * Get group messages
   */
  async getGroupMessages(groupId: string, params?: {
    limit?: number;
    offset?: number;
    since?: string; // ISO datetime
  }): Promise<GetGroupMessagesResponse> {
    return apiClient.get<GetGroupMessagesResponse>(`/social/groups/${groupId}/chat`, params);
  }

  /**
   * Send message to group
   */
  async sendGroupMessage(groupId: string, data: SendGroupMessageRequest): Promise<GroupMessage> {
    return apiClient.post<GroupMessage>(`/social/groups/${groupId}/chat`, data);
  }

  /**
   * Share meal in group
   */
  async shareMealInGroup(groupId: string, data: ShareMealInGroupRequest): Promise<GroupMessage> {
    return apiClient.post<GroupMessage>(`/social/groups/${groupId}/share-meal`, data);
  }

  /**
   * Share workout in group
   */
  async shareWorkoutInGroup(groupId: string, data: ShareWorkoutInGroupRequest): Promise<GroupMessage> {
    return apiClient.post<GroupMessage>(`/social/groups/${groupId}/share-workout`, data);
  }

  // Utility methods

  /**
   * Format date for API (YYYY-MM-DD)
   */
  formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Parse API date string to Date object
   */
  parseApiDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if user is online (based on last activity)
   */
  isUserOnline(lastActivity: string, thresholdMinutes: number = 5): boolean {
    const lastActivityDate = new Date(lastActivity);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60);
    return diffMinutes <= thresholdMinutes;
  }

  /**
   * Generate invite link for group
   */
  generateGroupInviteLink(groupId: string, inviteCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/groups/join?id=${groupId}&code=${inviteCode}`;
  }

  /**
   * Validate group name
   */
  validateGroupName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Group name is required' };
    }
    
    if (name.length > 100) {
      return { valid: false, error: 'Group name must be 100 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate group description
   */
  validateGroupDescription(description?: string): { valid: boolean; error?: string } {
    if (description && description.length > 1000) {
      return { valid: false, error: 'Group description must be 1000 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate message content
   */
  validateMessageContent(content: string): { valid: boolean; error?: string } {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'Message content is required' };
    }
    
    if (content.length > 2000) {
      return { valid: false, error: 'Message must be 2000 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate friend request message
   */
  validateFriendRequestMessage(message?: string): { valid: boolean; error?: string } {
    if (message && message.length > 500) {
      return { valid: false, error: 'Friend request message must be 500 characters or less' };
    }
    
    return { valid: true };
  }
}

export const socialApiService = new SocialApiService();