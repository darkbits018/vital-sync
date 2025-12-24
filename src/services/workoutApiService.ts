import { apiClient, PaginatedResponse } from './apiClient';
import { Workout, Exercise, Set } from '../types';

export interface ApiWorkout {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  duration: number; // in minutes
  calories: number;
  notes?: string;
  images?: string[];
  exercises: ApiExercise[];
  created_at: string;
  updated_at?: string;
}

export interface ApiExercise {
  id: string;
  name: string;
  order_index: number;
  rest_time?: number; // in seconds
  notes?: string;
  sets: ApiSet[];
}

export interface ApiSet {
  id: string;
  reps: number;
  weight: number; // in kg
  completed: boolean;
  order_index: number;
}

export interface CreateWorkoutRequest {
  name: string;
  date: string; // YYYY-MM-DD format
  duration: number;
  calories: number;
  notes?: string;
  images?: string[];
  exercises: CreateExerciseRequest[];
}

export interface CreateExerciseRequest {
  name: string;
  rest_time?: number;
  notes?: string;
  sets: CreateSetRequest[];
}

export interface CreateSetRequest {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface GetWorkoutsResponse {
  workouts: ApiWorkout[];
  total: number;
  has_more: boolean;
}

export interface WorkoutStreakInfo {
  current_streak: number;
  longest_streak: number;
  last_workout_date?: string;
  streak_start_date?: string;
}

export interface WorkoutStats {
  total_workouts: number;
  total_duration: number;
  total_calories: number;
  average_duration: number;
  average_calories: number;
  current_streak: number;
  longest_streak: number;
  workouts_this_week: number;
  workouts_this_month: number;
  favorite_exercises: Array<{
    name: string;
    count: number;
    total_sets: number;
  }>;
}

export interface WorkoutPreset {
  id: string;
  name: string;
  exercises: PresetExercise[];
  estimated_duration: number;
  estimated_calories: number;
  category?: string;
  is_public: boolean;
  created_at: string;
  usage_count?: number;
}

export interface PresetExercise {
  id: string;
  name: string;
  sets: PresetSet[];
  rest_time?: number;
  notes?: string;
}

export interface PresetSet {
  reps: number;
  weight?: number;
}

export interface CreateWorkoutPresetRequest {
  name: string;
  exercises: CreatePresetExerciseRequest[];
  estimated_duration: number;
  estimated_calories: number;
  category?: string;
  is_public?: boolean;
}

export interface CreatePresetExerciseRequest {
  name: string;
  sets: CreatePresetSetRequest[];
  rest_time?: number;
  notes?: string;
}

export interface CreatePresetSetRequest {
  reps: number;
  weight?: number;
}

export interface UseWorkoutPresetRequest {
  date: string; // YYYY-MM-DD format
  notes?: string;
}

export class WorkoutApiService {
  /**
   * Get workouts with optional filtering
   */
  async getWorkouts(params?: {
    date_filter?: string; // YYYY-MM-DD
    limit?: number;
    offset?: number;
  }): Promise<GetWorkoutsResponse> {
    return apiClient.get<GetWorkoutsResponse>('/workouts', params);
  }

  /**
   * Create a new workout
   */
  async createWorkout(workout: CreateWorkoutRequest): Promise<ApiWorkout> {
    return apiClient.post<ApiWorkout>('/workouts', workout);
  }

  /**
   * Update an existing workout
   */
  async updateWorkout(workoutId: string, updates: Partial<CreateWorkoutRequest>): Promise<ApiWorkout> {
    return apiClient.put<ApiWorkout>(`/workouts/${workoutId}`, updates);
  }

  /**
   * Delete a workout
   */
  async deleteWorkout(workoutId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/workouts/${workoutId}`);
  }

  /**
   * Get workout streak information
   */
  async getWorkoutStreak(): Promise<WorkoutStreakInfo> {
    return apiClient.get<WorkoutStreakInfo>('/workouts/streak/info');
  }

  /**
   * Get workout statistics
   */
  async getWorkoutStats(days: number = 30): Promise<WorkoutStats> {
    return apiClient.get<WorkoutStats>('/workouts/stats/summary', { days });
  }

  /**
   * Get workout presets
   */
  async getWorkoutPresets(params?: {
    include_public?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<WorkoutPreset>> {
    const response = await apiClient.get<{
      workout_presets: WorkoutPreset[];
      total: number;
      has_more: boolean;
    }>('/workouts/presets', params);
    
    return {
      data: response.workout_presets,
      total: response.total,
      has_more: response.has_more,
    };
  }

  /**
   * Create workout preset
   */
  async createWorkoutPreset(preset: CreateWorkoutPresetRequest): Promise<WorkoutPreset> {
    return apiClient.post<WorkoutPreset>('/workouts/presets', preset);
  }

  /**
   * Use workout preset to create a workout
   */
  async useWorkoutPreset(presetId: string, data: UseWorkoutPresetRequest): Promise<ApiWorkout> {
    return apiClient.post<ApiWorkout>(`/workouts/presets/${presetId}/use`, data);
  }

  /**
   * Convert API workout to app Workout type
   */
  convertApiWorkoutToAppWorkout(apiWorkout: ApiWorkout): Workout {
    return {
      id: apiWorkout.id,
      name: apiWorkout.name,
      date: new Date(apiWorkout.date),
      duration: apiWorkout.duration,
      calories: apiWorkout.calories,
      notes: apiWorkout.notes,
      images: apiWorkout.images,
      exercises: apiWorkout.exercises.map(this.convertApiExerciseToAppExercise),
    };
  }

  /**
   * Convert API exercise to app Exercise type
   */
  convertApiExerciseToAppExercise(apiExercise: ApiExercise): Exercise {
    return {
      id: apiExercise.id,
      name: apiExercise.name,
      restTime: apiExercise.rest_time,
      notes: apiExercise.notes,
      sets: apiExercise.sets.map(this.convertApiSetToAppSet),
    };
  }

  /**
   * Convert API set to app Set type
   */
  convertApiSetToAppSet(apiSet: ApiSet): Set {
    return {
      reps: apiSet.reps,
      weight: apiSet.weight,
      completed: apiSet.completed,
    };
  }

  /**
   * Convert app Workout to API format
   */
  convertAppWorkoutToApiFormat(workout: Omit<Workout, 'id'>): CreateWorkoutRequest {
    return {
      name: workout.name,
      date: workout.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
      duration: workout.duration,
      calories: workout.calories,
      notes: workout.notes,
      images: workout.images,
      exercises: workout.exercises.map((exercise, index) => ({
        name: exercise.name,
        rest_time: exercise.restTime,
        notes: exercise.notes,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          completed: set.completed,
        })),
      })),
    };
  }

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
}

export const workoutApiService = new WorkoutApiService();