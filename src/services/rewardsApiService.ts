import { apiClient, PaginatedResponse } from './apiClient';

// Reward-related interfaces
export interface Reward {
  id: string;
  name: string;
  description: string;
  reward_type: 'badge' | 'points' | 'discount' | 'coupon' | 'achievement' | 'special';
  value: string;
  image_url?: string;
  icon_url?: string;
  is_active: boolean;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  max_claims?: number;
  current_claims: number;
  required_points?: number;
  required_achievement_ids?: string[];
  required_challenge_ids?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_claimable: boolean;
  user_has_claimed: boolean;
}

export interface GetRewardsResponse {
  rewards: Reward[];
  total_count: number;
  has_more: boolean;
}

export interface ClaimRewardRequest {
  notes?: string;
}

export interface ClaimedReward {
  id: string;
  reward_id: string;
  status: 'claimed' | 'expired' | 'used';
  claimed_at: string;
  expires_at?: string;
  used_at?: string;
  metadata?: Record<string, any>;
  notes?: string;
  reward_name: string;
  reward_description: string;
  reward_type: 'badge' | 'points' | 'discount' | 'coupon' | 'achievement' | 'special';
  reward_value: string;
  reward_image_url?: string;
  reward_icon_url?: string;
}

export interface GetUserRewardsResponse {
  rewards: ClaimedReward[];
  total_count: number;
  has_more: boolean;
}

// Achievement-related interfaces
export interface Achievement {
  id: string;
  name: string;
  description: string;
  achievement_type: 'milestone' | 'streak' | 'goal_completion' | 'social' | 'special' | 'first_time';
  category: 'nutrition' | 'workout' | 'medicine' | 'social' | 'challenge' | 'general';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  icon_url?: string;
  badge_url?: string;
  color?: string;
  target_value: number;
  target_unit: string;
  criteria: Record<string, any>;
  points_reward: number;
  reward_ids?: string[];
  is_active: boolean;
  is_hidden: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_progress: number;
  progress_percentage: number;
  is_unlocked: boolean;
  unlocked_at?: string;
}

export interface GetAchievementsResponse {
  achievements: Achievement[];
  total_count: number;
  has_more: boolean;
}

export interface UserAchievementProgress {
  id: string;
  achievement_id: string;
  current_progress: number;
  target_progress: number;
  progress_percentage: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  progress_data?: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
  achievement_name: string;
  achievement_description: string;
  achievement_type: string;
  category: string;
  difficulty: string;
  icon_url?: string;
  badge_url?: string;
  color?: string;
  points_reward: number;
}

export interface GetUserAchievementProgressResponse {
  achievements: UserAchievementProgress[];
  total_count: number;
  has_more: boolean;
}

export interface UnlockAchievementRequest {
  progress_data?: Record<string, any>;
  notes?: string;
}

// Points-related interfaces
export interface PointsBalance {
  id: string;
  user_id: string;
  total_points: number;
  available_points: number;
  spent_points: number;
  lifetime_earned: number;
  lifetime_spent: number;
  last_earned_at?: string;
  last_spent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  reference_id?: string;
  reference_type?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface GetPointsHistoryResponse {
  transactions: PointsTransaction[];
  total_count: number;
  current_balance: number;
}

export interface ChallengeRewards {
  challenge_id: string;
  challenge_name: string;
  rewards: Reward[];
  achievements: Achievement[];
  total_points_available: number;
}

export class RewardsApiService {
  // Rewards Management

  /**
   * Get available rewards
   */
  async getRewards(params?: {
    reward_type?: 'badge' | 'points' | 'discount' | 'coupon' | 'achievement' | 'special';
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<GetRewardsResponse> {
    return apiClient.get<GetRewardsResponse>('/rewards', params);
  }

  /**
   * Get specific reward details
   */
  async getReward(rewardId: string): Promise<Reward> {
    return apiClient.get<Reward>(`/rewards/${rewardId}`);
  }

  /**
   * Claim a reward
   */
  async claimReward(rewardId: string, data?: ClaimRewardRequest): Promise<ClaimedReward> {
    return apiClient.post<ClaimedReward>(`/rewards/${rewardId}/claim`, data);
  }

  /**
   * Get user's claimed rewards
   */
  async getUserRewards(userId: string, params?: {
    status?: 'available' | 'claimed' | 'expired' | 'locked';
    limit?: number;
    offset?: number;
  }): Promise<GetUserRewardsResponse> {
    return apiClient.get<GetUserRewardsResponse>(`/rewards/user/${userId}`, params);
  }

  /**
   * Get current user's claimed rewards
   */
  async getMyRewards(params?: {
    status?: 'available' | 'claimed' | 'expired' | 'locked';
    limit?: number;
    offset?: number;
  }): Promise<GetUserRewardsResponse> {
    return apiClient.get<GetUserRewardsResponse>('/rewards/me', params);
  }

  // Achievements Management

  /**
   * Get available achievements
   */
  async getAchievements(params?: {
    category?: 'nutrition' | 'workout' | 'medicine' | 'social' | 'challenge' | 'general';
    achievement_type?: 'milestone' | 'streak' | 'goal_completion' | 'social' | 'special' | 'first_time';
    is_active?: boolean;
    include_hidden?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<GetAchievementsResponse> {
    return apiClient.get<GetAchievementsResponse>('/achievements', params);
  }

  /**
   * Get specific achievement details
   */
  async getAchievement(achievementId: string): Promise<Achievement> {
    return apiClient.get<Achievement>(`/achievements/${achievementId}`);
  }

  /**
   * Unlock achievement (typically used by system processes)
   */
  async unlockAchievement(achievementId: string, data?: UnlockAchievementRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/achievements/${achievementId}/unlock`, data);
  }

  /**
   * Get user's achievement progress
   */
  async getUserAchievements(userId: string, params?: {
    is_unlocked?: boolean;
    category?: 'nutrition' | 'workout' | 'medicine' | 'social' | 'challenge' | 'general';
    limit?: number;
    offset?: number;
  }): Promise<GetUserAchievementProgressResponse> {
    return apiClient.get<GetUserAchievementProgressResponse>(`/achievements/user/${userId}`, params);
  }

  /**
   * Get current user's achievement progress
   */
  async getMyAchievementProgress(params?: {
    is_unlocked?: boolean;
    category?: 'nutrition' | 'workout' | 'medicine' | 'social' | 'challenge' | 'general';
    limit?: number;
    offset?: number;
  }): Promise<GetUserAchievementProgressResponse> {
    return apiClient.get<GetUserAchievementProgressResponse>('/achievements/progress', params);
  }

  // Points Management

  /**
   * Get user's points balance
   */
  async getPointsBalance(): Promise<PointsBalance> {
    return apiClient.get<PointsBalance>('/points');
  }

  /**
   * Get points transaction history
   */
  async getPointsHistory(params?: {
    transaction_type?: string;
    limit?: number;
    offset?: number;
  }): Promise<GetPointsHistoryResponse> {
    return apiClient.get<GetPointsHistoryResponse>('/points/history', params);
  }

  /**
   * Get challenge-specific rewards and achievements
   */
  async getChallengeRewards(challengeId: string): Promise<ChallengeRewards> {
    return apiClient.get<ChallengeRewards>(`/rewards/challenges/${challengeId}`);
  }

  // Utility methods

  /**
   * Check if reward is claimable
   */
  isRewardClaimable(reward: Reward, userPoints: number): boolean {
    if (!reward.is_active || reward.user_has_claimed) {
      return false;
    }

    // Check points requirement
    if (reward.required_points && userPoints < reward.required_points) {
      return false;
    }

    // Check date constraints
    const now = new Date();
    if (reward.start_date && now < new Date(reward.start_date)) {
      return false;
    }
    if (reward.end_date && now > new Date(reward.end_date)) {
      return false;
    }

    // Check claim limits
    if (reward.max_claims && reward.current_claims >= reward.max_claims) {
      return false;
    }

    return true;
  }

  /**
   * Check if achievement is unlocked
   */
  isAchievementUnlocked(achievement: Achievement): boolean {
    return achievement.is_unlocked;
  }

  /**
   * Calculate achievement progress percentage
   */
  calculateAchievementProgress(currentProgress: number, targetProgress: number): number {
    if (targetProgress === 0) return 0;
    return Math.min((currentProgress / targetProgress) * 100, 100);
  }

  /**
   * Get achievement difficulty color
   */
  getAchievementDifficultyColor(difficulty: string): string {
    const colors = {
      easy: '#4CAF50',
      medium: '#FF9800',
      hard: '#F44336',
      legendary: '#9C27B0',
    };
    return colors[difficulty as keyof typeof colors] || '#757575';
  }

  /**
   * Get reward type icon
   */
  getRewardTypeIcon(rewardType: string): string {
    const icons = {
      badge: '🏆',
      points: '⭐',
      discount: '💰',
      coupon: '🎫',
      achievement: '🏅',
      special: '🎁',
    };
    return icons[rewardType as keyof typeof icons] || '🎁';
  }

  /**
   * Format points amount for display
   */
  formatPoints(points: number): string {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  }

  /**
   * Get time until reward expires
   */
  getTimeUntilExpiry(expiryDate: string): { expired: boolean; timeLeft?: string } {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    if (now >= expiry) {
      return { expired: true };
    }

    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return { expired: false, timeLeft: `${diffDays}d ${diffHours}h` };
    } else if (diffHours > 0) {
      return { expired: false, timeLeft: `${diffHours}h ${diffMinutes}m` };
    } else {
      return { expired: false, timeLeft: `${diffMinutes}m` };
    }
  }

  /**
   * Group achievements by category
   */
  groupAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
    return achievements.reduce((groups, achievement) => {
      const category = achievement.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(achievement);
      return groups;
    }, {} as Record<string, Achievement[]>);
  }

  /**
   * Group rewards by type
   */
  groupRewardsByType(rewards: Reward[]): Record<string, Reward[]> {
    return rewards.reduce((groups, reward) => {
      const type = reward.reward_type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(reward);
      return groups;
    }, {} as Record<string, Reward[]>);
  }

  /**
   * Sort achievements by progress (unlocked first, then by progress percentage)
   */
  sortAchievementsByProgress(achievements: UserAchievementProgress[]): UserAchievementProgress[] {
    return achievements.sort((a, b) => {
      // Unlocked achievements first
      if (a.is_unlocked && !b.is_unlocked) return -1;
      if (!a.is_unlocked && b.is_unlocked) return 1;
      
      // Then by progress percentage (descending)
      return b.progress_percentage - a.progress_percentage;
    });
  }

  /**
   * Sort rewards by claimability and points required
   */
  sortRewardsByClaimability(rewards: Reward[], userPoints: number): Reward[] {
    return rewards.sort((a, b) => {
      const aClaimable = this.isRewardClaimable(a, userPoints);
      const bClaimable = this.isRewardClaimable(b, userPoints);
      
      // Claimable rewards first
      if (aClaimable && !bClaimable) return -1;
      if (!aClaimable && bClaimable) return 1;
      
      // Then by points required (ascending)
      const aPoints = a.required_points || 0;
      const bPoints = b.required_points || 0;
      return aPoints - bPoints;
    });
  }

  /**
   * Get achievement category display name
   */
  getAchievementCategoryDisplayName(category: string): string {
    const displayNames = {
      nutrition: 'Nutrition',
      workout: 'Fitness',
      medicine: 'Health',
      social: 'Social',
      challenge: 'Challenges',
      general: 'General',
    };
    return displayNames[category as keyof typeof displayNames] || category;
  }

  /**
   * Get reward type display name
   */
  getRewardTypeDisplayName(rewardType: string): string {
    const displayNames = {
      badge: 'Badge',
      points: 'Points',
      discount: 'Discount',
      coupon: 'Coupon',
      achievement: 'Achievement',
      special: 'Special Reward',
    };
    return displayNames[rewardType as keyof typeof displayNames] || rewardType;
  }
}

export const rewardsApiService = new RewardsApiService();