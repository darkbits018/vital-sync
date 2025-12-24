import { apiClient, PaginatedResponse } from './apiClient';

// Challenge-related interfaces
export interface Challenge {
  id: string;
  name: string;
  description: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  creator_id: string;
  is_active: boolean;
  is_public: boolean;
  rules: string;
  rewards: string;
  category: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
  max_members: number;
  image_url?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  creator_name: string;
  member_count: number;
  goals: ChallengeGoal[];
  user_is_member: boolean;
  user_rank?: number;
  user_score: number;
}

export interface ChallengeGoal {
  id: string;
  name: string;
  description: string;
  target_value: number;
  unit: string;
  goal_type: 'total' | 'daily_average' | 'streak' | 'target_value';
  weight: number;
  is_required: boolean;
  deadline?: string; // YYYY-MM-DD
}

export interface GetChallengesResponse {
  challenges: Challenge[];
  total: number;
  has_more: boolean;
}

export interface CreateChallengeRequest {
  name: string;
  description: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  is_public?: boolean;
  rules: string;
  rewards: string;
  category: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
  max_members?: number;
  image_url?: string;
  goals: CreateChallengeGoalRequest[];
}

export interface CreateChallengeGoalRequest {
  name: string;
  description: string;
  target_value: number;
  unit: string;
  goal_type: 'total' | 'daily_average' | 'streak' | 'target_value';
  weight?: number;
  is_required?: boolean;
  deadline?: string; // YYYY-MM-DD
}

export interface JoinChallengeResponse {
  message: string;
  member_id: string;
  joined_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  current_score: number;
  completion_percentage: number;
  joined_at: string;
}

export interface ChallengeLeaderboard {
  challenge_id: string;
  challenge_name: string;
  total_members: number;
  leaderboard: LeaderboardEntry[];
  user_entry?: LeaderboardEntry;
}

export interface UpdateProgressRequest {
  goal_id: string;
  progress_value: number;
  progress_date: string; // YYYY-MM-DD
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  member_id: string;
  goal_id: string;
  current_value: number;
  progress_date: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  goal_name: string;
  goal_target_value: number;
  goal_unit: string;
  goal_type: string;
  progress_percentage: number;
}

export interface ChallengeTemplate {
  name: string;
  description: string;
  category: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
  duration_days: number;
  suggested_goals: Array<{
    name: string;
    target_value: number;
    unit: string;
    goal_type: 'total' | 'daily_average' | 'streak' | 'target_value';
  }>;
  rules_template: string;
  rewards_template: string;
}

export class ChallengesApiService {
  /**
   * Get available challenges with filtering
   */
  async getChallenges(params?: {
    category?: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom';
    status?: 'upcoming' | 'active' | 'completed';
    is_public?: boolean;
    search?: string;
    creator_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<GetChallengesResponse> {
    return apiClient.get<GetChallengesResponse>('/challenges', params);
  }

  /**
   * Get specific challenge by ID
   */
  async getChallenge(challengeId: string): Promise<Challenge> {
    return apiClient.get<Challenge>(`/challenges/${challengeId}`);
  }

  /**
   * Create new challenge
   */
  async createChallenge(data: CreateChallengeRequest): Promise<Challenge> {
    return apiClient.post<Challenge>('/challenges', data);
  }

  /**
   * Update existing challenge
   */
  async updateChallenge(challengeId: string, updates: Partial<CreateChallengeRequest>): Promise<Challenge> {
    return apiClient.put<Challenge>(`/challenges/${challengeId}`, updates);
  }

  /**
   * Delete challenge
   */
  async deleteChallenge(challengeId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/challenges/${challengeId}`);
  }

  /**
   * Join challenge
   */
  async joinChallenge(challengeId: string): Promise<JoinChallengeResponse> {
    return apiClient.post<JoinChallengeResponse>(`/challenges/${challengeId}/join`);
  }

  /**
   * Leave challenge
   */
  async leaveChallenge(challengeId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/challenges/${challengeId}/leave`);
  }

  /**
   * Get challenge leaderboard
   */
  async getChallengeLeaderboard(challengeId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<ChallengeLeaderboard> {
    return apiClient.get<ChallengeLeaderboard>(`/challenges/${challengeId}/leaderboard`, params);
  }

  /**
   * Update challenge progress
   */
  async updateChallengeProgress(challengeId: string, data: UpdateProgressRequest): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`/challenges/${challengeId}/progress`, data);
  }

  /**
   * Get user's progress for a challenge
   */
  async getChallengeProgress(challengeId: string): Promise<ChallengeProgress[]> {
    return apiClient.get<ChallengeProgress[]>(`/challenges/${challengeId}/progress`);
  }

  /**
   * Get challenge templates
   */
  async getChallengeTemplates(): Promise<ChallengeTemplate[]> {
    return apiClient.get<ChallengeTemplate[]>('/challenges/templates');
  }

  /**
   * Get user's participated challenges
   */
  async getUserChallenges(params?: {
    status?: 'upcoming' | 'active' | 'completed';
    limit?: number;
    offset?: number;
  }): Promise<GetChallengesResponse> {
    return apiClient.get<GetChallengesResponse>('/challenges/user', params);
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
   * Calculate challenge duration in days
   */
  calculateChallengeDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if challenge is currently active
   */
  isChallengeActive(challenge: Challenge): boolean {
    const now = new Date();
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    
    return now >= startDate && now <= endDate && challenge.is_active;
  }

  /**
   * Check if challenge is upcoming
   */
  isChallengeUpcoming(challenge: Challenge): boolean {
    const now = new Date();
    const startDate = new Date(challenge.start_date);
    
    return now < startDate && challenge.is_active;
  }

  /**
   * Check if challenge is completed
   */
  isChallengeCompleted(challenge: Challenge): boolean {
    const now = new Date();
    const endDate = new Date(challenge.end_date);
    
    return now > endDate || challenge.status === 'completed';
  }

  /**
   * Calculate progress percentage for a goal
   */
  calculateGoalProgress(currentValue: number, targetValue: number): number {
    if (targetValue === 0) return 0;
    return Math.min((currentValue / targetValue) * 100, 100);
  }

  /**
   * Get challenge status based on dates
   */
  getChallengeStatus(challenge: Challenge): 'upcoming' | 'active' | 'completed' | 'cancelled' {
    if (!challenge.is_active) return 'cancelled';
    
    if (this.isChallengeUpcoming(challenge)) return 'upcoming';
    if (this.isChallengeActive(challenge)) return 'active';
    if (this.isChallengeCompleted(challenge)) return 'completed';
    
    return challenge.status;
  }

  /**
   * Validate challenge name
   */
  validateChallengeName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Challenge name is required' };
    }
    
    if (name.length > 100) {
      return { valid: false, error: 'Challenge name must be 100 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate challenge description
   */
  validateChallengeDescription(description: string): { valid: boolean; error?: string } {
    if (!description || description.trim().length === 0) {
      return { valid: false, error: 'Challenge description is required' };
    }
    
    if (description.length > 1000) {
      return { valid: false, error: 'Challenge description must be 1000 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate challenge dates
   */
  validateChallengeDates(startDate: string, endDate: string): { valid: boolean; error?: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (start >= end) {
      return { valid: false, error: 'End date must be after start date' };
    }
    
    if (end <= now) {
      return { valid: false, error: 'End date must be in the future' };
    }
    
    const maxDuration = 365; // days
    const duration = this.calculateChallengeDuration(startDate, endDate);
    if (duration > maxDuration) {
      return { valid: false, error: `Challenge duration cannot exceed ${maxDuration} days` };
    }
    
    return { valid: true };
  }

  /**
   * Validate challenge rules
   */
  validateChallengeRules(rules: string): { valid: boolean; error?: string } {
    if (!rules || rules.trim().length === 0) {
      return { valid: false, error: 'Challenge rules are required' };
    }
    
    if (rules.length > 2000) {
      return { valid: false, error: 'Challenge rules must be 2000 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate challenge rewards
   */
  validateChallengeRewards(rewards: string): { valid: boolean; error?: string } {
    if (!rewards || rewards.trim().length === 0) {
      return { valid: false, error: 'Challenge rewards are required' };
    }
    
    if (rewards.length > 1000) {
      return { valid: false, error: 'Challenge rewards must be 1000 characters or less' };
    }
    
    return { valid: true };
  }

  /**
   * Validate challenge goals
   */
  validateChallengeGoals(goals: CreateChallengeGoalRequest[]): { valid: boolean; error?: string } {
    if (!goals || goals.length === 0) {
      return { valid: false, error: 'At least one goal is required' };
    }
    
    if (goals.length > 10) {
      return { valid: false, error: 'Maximum 10 goals allowed per challenge' };
    }
    
    for (const goal of goals) {
      if (!goal.name || goal.name.trim().length === 0) {
        return { valid: false, error: 'Goal name is required' };
      }
      
      if (goal.name.length > 100) {
        return { valid: false, error: 'Goal name must be 100 characters or less' };
      }
      
      if (goal.target_value <= 0) {
        return { valid: false, error: 'Goal target value must be greater than 0' };
      }
      
      if (goal.target_value > 1000000) {
        return { valid: false, error: 'Goal target value cannot exceed 1,000,000' };
      }
    }
    
    return { valid: true };
  }

  /**
   * Create challenge from template
   */
  createChallengeFromTemplate(
    template: ChallengeTemplate,
    customData: {
      name?: string;
      startDate: string;
      endDate: string;
      isPublic?: boolean;
      maxMembers?: number;
    }
  ): CreateChallengeRequest {
    return {
      name: customData.name || template.name,
      description: template.description,
      start_date: customData.startDate,
      end_date: customData.endDate,
      is_public: customData.isPublic ?? true,
      rules: template.rules_template,
      rewards: template.rewards_template,
      category: template.category,
      max_members: customData.maxMembers || 100,
      goals: template.suggested_goals.map(goal => ({
        name: goal.name,
        description: `Target: ${goal.target_value} ${goal.unit}`,
        target_value: goal.target_value,
        unit: goal.unit,
        goal_type: goal.goal_type,
        weight: 1.0,
        is_required: true,
      })),
    };
  }
}

export const challengesApiService = new ChallengesApiService();