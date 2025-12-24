// API Client
export { apiClient } from './apiClient';
export type { ApiResponse, PaginatedResponse, ApiError } from './apiClient';

// Service Manager
export { apiServiceManager } from './apiServiceManager';

// Integrated Services (Main App Services)
export { 
  authService, 
  chatService, 
  mealService, 
  workoutService 
} from './integratedApiService';

// Individual API Services (Direct FastAPI Backend Access)
export { authApiService } from './authApiService';
export { nutritionApiService } from './nutritionApiService';
export { workoutApiService } from './workoutApiService';
export { medicineApiService } from './medicineApiServiceNew';
export { analyticsApiService } from './analyticsApiService';
export { uploadApiService } from './uploadApiService';
export { socialApiService } from './socialApiService';
export { challengesApiService } from './challengesApiService';
export { rewardsApiService } from './rewardsApiService';

// Aliases for backward compatibility
export { socialApiService as friendsApi } from './socialApiService';
export { socialApiService as groupApi } from './socialApiService';
export { challengesApiService as challengeApi } from './challengesApiService';
export { rewardsApiService as rewardApi } from './rewardsApiService';
export { medicineApiService as medicineApi } from './medicineApiServiceNew';

// Service Types - Auth
export type {
  RegisterUserRequest,
  RegisterUserResponse,
  LoginResponse,
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from './authApiService';

// Service Types - Nutrition
export type {
  ApiMeal,
  CreateMealRequest,
  GetMealsResponse,
  DailyTotals,
  FoodSearchResult,
  BarcodeResult,
  MealPreset,
  CreateMealPresetRequest,
  UseMealPresetRequest,
} from './nutritionApiService';

// Service Types - Workout
export type {
  ApiWorkout,
  ApiExercise,
  ApiSet,
  CreateWorkoutRequest,
  CreateExerciseRequest,
  CreateSetRequest,
  GetWorkoutsResponse,
  WorkoutStreakInfo,
  WorkoutStats,
  WorkoutPreset,
  CreateWorkoutPresetRequest,
  UseWorkoutPresetRequest,
} from './workoutApiService';

// Service Types - Medicine
export type {
  ApiMedicine,
  CreateMedicineRequest,
  GetMedicinesResponse,
  MedicineReminder,
  MarkReminderTakenRequest,
  MarkReminderMissedRequest,
  SnoozeReminderRequest,
  MedicineLog,
  AdherenceStats,
} from './medicineApiServiceNew';

// Service Types - Analytics
export type {
  NutritionAnalytics,
  WorkoutAnalytics,
  ProgressTracking,
  StreakAnalysis,
  HealthMetrics,
  BMRCalculation,
  TDEECalculation,
  CalculateMacrosRequest,
  DashboardData,
} from './analyticsApiService';

// Service Types - Upload
export type {
  UploadedFile,
  UploadResponse,
  MultipleUploadResponse,
  GetFilesResponse,
  StorageUsage,
  UploadConfig,
  BulkDeleteRequest,
  BulkDeleteResponse,
} from './uploadApiService';

// Service Types - Social
export type {
  Friend,
  GetFriendsResponse,
  SendFriendRequestRequest,
  FriendRequest,
  FriendRequestResponse,
  UserSearchResult,
  SearchUsersResponse,
  QRCodeResponse,
  Group,
  GetGroupsResponse,
  CreateGroupRequest,
  JoinGroupRequest,
  GroupMessage,
  GetGroupMessagesResponse,
  SendGroupMessageRequest,
  ShareMealInGroupRequest,
  ShareWorkoutInGroupRequest,
} from './socialApiService';

// Service Types - Challenges
export type {
  Challenge,
  ChallengeGoal,
  GetChallengesResponse,
  CreateChallengeRequest,
  CreateChallengeGoalRequest,
  JoinChallengeResponse,
  LeaderboardEntry,
  ChallengeLeaderboard,
  UpdateProgressRequest,
  ChallengeProgress,
  ChallengeTemplate,
} from './challengesApiService';

// Service Types - Rewards
export type {
  Reward,
  GetRewardsResponse,
  ClaimRewardRequest,
  ClaimedReward,
  GetUserRewardsResponse,
  Achievement,
  GetAchievementsResponse,
  UserAchievementProgress,
  GetUserAchievementProgressResponse,
  UnlockAchievementRequest,
  PointsBalance,
  PointsTransaction,
  GetPointsHistoryResponse,
  ChallengeRewards,
} from './rewardsApiService';