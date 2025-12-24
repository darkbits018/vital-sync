import { apiClient } from './apiClient';
import { User, MacroTargets } from '../types';

export interface RegisterUserRequest {
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface RegisterUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    created_at: string;
  };
  macro_targets: MacroTargets;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    created_at: string;
  };
  macro_targets: MacroTargets;
  is_new_user: boolean;
}

export interface UserProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    created_at: string;
  };
  macro_targets: MacroTargets;
  stats: {
    total_workouts: number;
    total_meals: number;
    current_streak: number;
  };
  profile_completion: number;
}

export interface UpdateProfileRequest {
  name?: string;
  weight?: number;
  goal?: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    created_at: string;
  };
  macro_targets: MacroTargets;
}

export class AuthApiService {
  /**
   * Register a new user
   */
  async register(userData: RegisterUserRequest): Promise<RegisterUserResponse> {
    return apiClient.post<RegisterUserResponse>('/auth/register', userData);
  }

  /**
   * Login user (Firebase token should be in Authorization header)
   */
  async login(): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login');
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>('/auth/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return apiClient.put<UpdateProfileResponse>('/auth/profile', updates);
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/auth/account');
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/logout');
  }

  /**
   * Convert API user data to app User type
   */
  convertApiUserToAppUser(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      height: apiUser.height,
      weight: apiUser.weight,
      age: apiUser.age,
      gender: apiUser.gender,
      goal: apiUser.goal,
      activityLevel: apiUser.activity_level,
      createdAt: new Date(apiUser.created_at),
      firebaseUid: apiUser.firebase_uid,
    };
  }

  /**
   * Convert app User type to API format
   */
  convertAppUserToApiFormat(user: Partial<User>): Partial<RegisterUserRequest> {
    return {
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      age: user.age,
      gender: user.gender,
      goal: user.goal,
      activity_level: user.activityLevel,
    };
  }
}

export const authApiService = new AuthApiService();