import { apiClient, PaginatedResponse } from './apiClient';
import { Meal, MacroTargets } from '../types';

export interface ApiMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  date: string; // YYYY-MM-DD format
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateMealRequest {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  date: string; // YYYY-MM-DD format
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url?: string;
  notes?: string;
}

export interface GetMealsResponse {
  meals: ApiMeal[];
  total: number;
  has_more: boolean;
  daily_totals?: {
    date: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_fiber: number;
    total_sugar: number;
    meal_count: number;
  };
}

export interface DailyTotals {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  total_sugar: number;
  meal_count: number;
}

export interface FoodSearchResult {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  source: string;
  barcode?: string;
}

export interface BarcodeResult {
  product_name: string;
  brand?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  barcode: string;
  image_url?: string;
}

export interface MealPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  is_public: boolean;
  notes?: string;
  created_at: string;
  usage_count?: number;
}

export interface CreateMealPresetRequest {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  is_public?: boolean;
  notes?: string;
}

export interface UseMealPresetRequest {
  date: string; // YYYY-MM-DD format
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
}

export class NutritionApiService {
  /**
   * Get meals with optional filtering
   */
  async getMeals(params?: {
    date_filter?: string; // YYYY-MM-DD
    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    limit?: number;
    offset?: number;
  }): Promise<GetMealsResponse> {
    return apiClient.get<GetMealsResponse>('/nutrition/meals', params);
  }

  /**
   * Create a new meal
   */
  async createMeal(meal: CreateMealRequest): Promise<ApiMeal> {
    return apiClient.post<ApiMeal>('/nutrition/meals', meal);
  }

  /**
   * Update an existing meal
   */
  async updateMeal(mealId: string, updates: Partial<CreateMealRequest>): Promise<ApiMeal> {
    return apiClient.put<ApiMeal>(`/nutrition/meals/${mealId}`, updates);
  }

  /**
   * Delete a meal
   */
  async deleteMeal(mealId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/nutrition/meals/${mealId}`);
  }

  /**
   * Get meals by specific date
   */
  async getMealsByDate(date: string): Promise<ApiMeal[]> {
    return apiClient.get<ApiMeal[]>(`/nutrition/meals/date/${date}`);
  }

  /**
   * Get daily totals for a specific date
   */
  async getDailyTotals(date: string): Promise<DailyTotals> {
    return apiClient.get<DailyTotals>(`/nutrition/daily-totals/${date}`);
  }

  /**
   * Search for foods
   */
  async searchFoods(query: string, limit: number = 20): Promise<FoodSearchResult[]> {
    return apiClient.get<FoodSearchResult[]>('/nutrition/search', { query, limit });
  }

  /**
   * Lookup food by barcode
   */
  async lookupBarcode(barcode: string): Promise<BarcodeResult> {
    return apiClient.get<BarcodeResult>(`/nutrition/barcode/${barcode}`);
  }

  /**
   * Get meal presets
   */
  async getMealPresets(params?: {
    include_public?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<MealPreset>> {
    const response = await apiClient.get<{
      meal_presets: MealPreset[];
      total: number;
      has_more: boolean;
    }>('/nutrition/meal-presets', params);
    
    return {
      data: response.meal_presets,
      total: response.total,
      has_more: response.has_more,
    };
  }

  /**
   * Create meal preset
   */
  async createMealPreset(preset: CreateMealPresetRequest): Promise<MealPreset> {
    return apiClient.post<MealPreset>('/nutrition/meal-presets', preset);
  }

  /**
   * Use meal preset to create a meal
   */
  async useMealPreset(presetId: string, data: UseMealPresetRequest): Promise<ApiMeal> {
    return apiClient.post<ApiMeal>(`/nutrition/meal-presets/${presetId}/use`, data);
  }

  /**
   * Convert API meal to app Meal type
   */
  convertApiMealToAppMeal(apiMeal: ApiMeal): Meal {
    return {
      id: apiMeal.id,
      name: apiMeal.name,
      calories: apiMeal.calories,
      protein: apiMeal.protein,
      carbs: apiMeal.carbs,
      fat: apiMeal.fat,
      fiber: apiMeal.fiber,
      sugar: apiMeal.sugar,
      date: new Date(apiMeal.date),
      mealType: apiMeal.meal_type,
      image: apiMeal.image_url,
    };
  }

  /**
   * Convert app Meal to API format
   */
  convertAppMealToApiFormat(meal: Omit<Meal, 'id'>): CreateMealRequest {
    return {
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      sugar: meal.sugar,
      date: meal.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
      meal_type: meal.mealType,
      image_url: meal.image,
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

export const nutritionApiService = new NutritionApiService();