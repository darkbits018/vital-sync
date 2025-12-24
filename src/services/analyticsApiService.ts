import { apiClient } from './apiClient';
import { MacroTargets } from '../types';

export interface NutritionAnalytics {
  analytics: {
    period_summary: {
      total_meals: number;
      average_daily_calories: number;
      days_tracked: number;
    };
    daily_summaries: Array<{
      date: string;
      actual: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      target: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      adherence_percentage: number;
      meal_count: number;
    }>;
    macro_trends: {
      calories: number[];
      protein: number[];
      carbs: number[];
      fat: number[];
    };
    adherence_stats: {
      overall_adherence: number;
      calories_adherence: number;
      protein_adherence: number;
      carbs_adherence: number;
      fat_adherence: number;
    };
    meal_timing_patterns: {
      breakfast: number;
      lunch: number;
      dinner: number;
      snack: number;
    };
  };
  generated_at: string;
  period_analyzed: string;
}

export interface WorkoutAnalytics {
  analytics: {
    frequency_stats: {
      total_workouts: number;
      average_per_week: number;
      most_active_day: string;
      least_active_day: string;
      workout_days: number;
      rest_days: number;
    };
    performance_trends: Array<{
      exercise_name: string;
      total_sets: number;
      total_reps: number;
      total_weight: number;
      average_weight: number;
      max_weight: number;
      progression_percentage: number;
    }>;
    duration_analysis: {
      total_duration: number;
      average_duration: number;
      shortest_workout: number;
      longest_workout: number;
    };
  };
  generated_at: string;
  period_analyzed: string;
}

export interface ProgressTracking {
  exercise_progress: Array<{
    exercise_name: string;
    strength_gains: {
      start_weight: number;
      current_weight: number;
      improvement_percentage: number;
    };
    volume_trends: {
      total_volume_trend: number[];
      average_volume: number;
    };
    consistency: {
      sessions_completed: number;
      consistency_percentage: number;
    };
  }>;
  overall_progress: {
    total_strength_gain: number;
    total_volume_increase: number;
    consistency_score: number;
  };
  generated_at: string;
  period_analyzed: string;
}

export interface StreakAnalysis {
  streaks: {
    current_streak: number;
    longest_streak: number;
    streak_history: Array<{
      start_date: string;
      end_date: string;
      length: number;
    }>;
    streak_breakdown_reasons: {
      missed_day: number;
      illness: number;
      travel: number;
    };
    consistency_score: number;
  };
  generated_at: string;
  period_analyzed: string;
}

export interface HealthMetrics {
  current_weight: number;
  target_weight?: number;
  bmi: number;
  bmi_category: string;
  body_fat_estimate?: number;
  water_intake_recommendation: number;
  calories_burned_estimate: number;
}

export interface BMRCalculation {
  bmr: number;
  formula: string;
  user_data: {
    weight: number;
    height: number;
    age: number;
    gender: string;
  };
  calculated_at: string;
}

export interface TDEECalculation {
  tdee: number;
  bmr: number;
  activity_level: string;
  activity_multiplier: number;
  calculated_at: string;
}

export interface CalculateMacrosRequest {
  weight?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
}

export interface DashboardData {
  period_analyzed: string;
  nutrition_summary: {
    total_meals: number;
    average_daily_calories: number;
    adherence_rate: number;
    current_streak: number;
  };
  workout_summary: {
    total_workouts: number;
    average_per_week: number;
    total_duration: number;
    current_streak: number;
  };
  health_metrics: {
    current_weight: number;
    bmi: number;
    bmi_category: string;
    daily_calorie_target: number;
  };
  achievements: Array<{
    type: string;
    value: number;
    description: string;
  }>;
  recommendations: string[];
  generated_at: string;
}

export class AnalyticsApiService {
  /**
   * Get nutrition analytics
   */
  async getNutritionAnalytics(params?: {
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    days?: number;
  }): Promise<NutritionAnalytics> {
    return apiClient.get<NutritionAnalytics>('/analytics/nutrition', params);
  }

  /**
   * Get workout analytics
   */
  async getWorkoutAnalytics(params?: {
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    days?: number;
  }): Promise<WorkoutAnalytics> {
    return apiClient.get<WorkoutAnalytics>('/analytics/workouts', params);
  }

  /**
   * Get progress tracking analytics
   */
  async getProgressTracking(params?: {
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    days?: number;
  }): Promise<ProgressTracking> {
    return apiClient.get<ProgressTracking>('/analytics/workouts/progress', params);
  }

  /**
   * Get streak analysis
   */
  async getStreakAnalysis(
    activityType: 'workout' | 'nutrition',
    days: number = 365
  ): Promise<StreakAnalysis> {
    return apiClient.get<StreakAnalysis>('/analytics/streaks', {
      activity_type: activityType,
      days,
    });
  }

  /**
   * Get health metrics
   */
  async getHealthMetrics(): Promise<HealthMetrics> {
    return apiClient.get<HealthMetrics>('/analytics/health/metrics');
  }

  /**
   * Get current macro targets
   */
  async getMacroTargets(): Promise<MacroTargets> {
    return apiClient.get<MacroTargets>('/analytics/health/macro-targets');
  }

  /**
   * Recalculate macro targets
   */
  async calculateMacros(data: CalculateMacrosRequest): Promise<MacroTargets> {
    return apiClient.post<MacroTargets>('/analytics/health/calculate-macros', data);
  }

  /**
   * Get BMR calculation
   */
  async getBMR(): Promise<BMRCalculation> {
    return apiClient.get<BMRCalculation>('/analytics/health/bmr');
  }

  /**
   * Get TDEE calculation
   */
  async getTDEE(): Promise<TDEECalculation> {
    return apiClient.get<TDEECalculation>('/analytics/health/tdee');
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboard(days: number = 30): Promise<DashboardData> {
    return apiClient.get<DashboardData>('/analytics/dashboard', { days });
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

export const analyticsApiService = new AnalyticsApiService();