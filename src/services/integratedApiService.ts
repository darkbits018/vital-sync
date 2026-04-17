import { User, ChatMessage, Meal, Workout, MacroTargets } from '../types';
import { PreferenceLearnedEvent } from '../types/preferences';
import { apiServiceManager } from './apiServiceManager';
import { AIPreferenceExtractor } from './aiPreferenceExtractor';

// Store for preference learned events
let preferenceLearnedEvents: PreferenceLearnedEvent[] = [];

// Helper to get or create a chat session, persisted in sessionStorage
async function getOrCreateSession(): Promise<string> {
  const stored = apiServiceManager.chat.getStoredSessionId();
  if (stored) return stored;

  const { session_id } = await apiServiceManager.chat.createSession();
  apiServiceManager.chat.storeSessionId(session_id);
  return session_id;
}

/**
 * Integrated Auth Service
 * Uses FastAPI backend for all authentication operations
 */
export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await apiServiceManager.auth.login();
      return apiServiceManager.auth.convertApiUserToAppUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async register(userData: Partial<User>): Promise<User> {
    try {
      console.log("Registering user with data:", userData);
      const apiUserData = apiServiceManager.auth.convertAppUserToApiFormat(userData);
      const response = await apiServiceManager.auth.register(apiUserData as any);
      return apiServiceManager.auth.convertApiUserToAppUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  async getProfile(): Promise<{ user: User; macroTargets: MacroTargets }> {
    try {
      const response = await apiServiceManager.auth.getProfile();
      const user = apiServiceManager.auth.convertApiUserToAppUser(response.user);
      return {
        user,
        macroTargets: response.macro_targets,
      };
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const apiUpdates = apiServiceManager.auth.convertAppUserToApiFormat(updates);
      const response = await apiServiceManager.auth.updateProfile(apiUpdates as any);
      return apiServiceManager.auth.convertApiUserToAppUser(response.user);
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  },
};

/**
 * Integrated Chat Service
 * Connects to the FastAPI AI agent backend
 */
export const chatService = {
  async sendMessage(message: string): Promise<ChatMessage & { learnedPreferences?: PreferenceLearnedEvent[] }> {
    const [sessionId, learnedPreferences] = await Promise.all([
      getOrCreateSession(),
      AIPreferenceExtractor.extractPreferences(message),
    ]);

    preferenceLearnedEvents.push(...learnedPreferences);

    const response = await apiServiceManager.chat.sendMessage(message, sessionId);

    // Keep the session id in sync (backend may return a new one)
    apiServiceManager.chat.storeSessionId(response.session_id);

    const chatMessage: ChatMessage = {
      id: `${Date.now()}`,
      content: response.response,
      sender: 'ai',
      timestamp: new Date(),
      type: 'general',
    };

    return {
      ...chatMessage,
      learnedPreferences: learnedPreferences.length > 0 ? learnedPreferences : undefined,
    };
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      const sessionId = apiServiceManager.chat.getStoredSessionId();
      if (!sessionId) return [];

      const response = await apiServiceManager.chat.getHistory(sessionId);
      return response.messages.map((m, i) => ({
        id: `history-${i}`,
        content: m.content,
        sender: m.role === 'user' ? 'user' : ('ai' as const),
        timestamp: new Date(m.timestamp),
        type: 'general' as const,
      }));
    } catch (error) {
      console.error('Get chat history failed:', error);
      return [];
    }
  },

  async clearSession(): Promise<void> {
    const sessionId = apiServiceManager.chat.getStoredSessionId();
    if (sessionId) {
      try {
        await apiServiceManager.chat.endSession(sessionId);
      } catch {
        // best-effort
      }
    }
    apiServiceManager.chat.clearStoredSession();
    preferenceLearnedEvents = [];
  },

  getRecentLearnedPreferences(): PreferenceLearnedEvent[] {
    return preferenceLearnedEvents.slice(-5);
  },

  clearLearnedPreferences(): void {
    preferenceLearnedEvents = [];
  },
};

/**
 * Integrated Meal Service
 * Uses FastAPI backend for all meal operations
 */
export const mealService = {
  async getMeals(date?: Date): Promise<Meal[]> {
    try {
      const dateFilter = date ? apiServiceManager.nutrition.formatDateForApi(date) : undefined;
      const response = await apiServiceManager.nutrition.getMeals({ date_filter: dateFilter });
      return response.meals.map(apiMeal => apiServiceManager.nutrition.convertApiMealToAppMeal(apiMeal));
    } catch (error) {
      console.error('Get meals failed:', error);
      throw error;
    }
  },

  async addMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    try {
      const apiMealData = apiServiceManager.nutrition.convertAppMealToApiFormat(meal);
      const response = await apiServiceManager.nutrition.createMeal(apiMealData);
      return apiServiceManager.nutrition.convertApiMealToAppMeal(response);
    } catch (error) {
      console.error('Add meal failed:', error);
      throw error;
    }
  },

  async updateMeal(meal: Meal): Promise<Meal> {
    try {
      const apiMealData = apiServiceManager.nutrition.convertAppMealToApiFormat(meal);
      const response = await apiServiceManager.nutrition.updateMeal(meal.id, apiMealData);
      return apiServiceManager.nutrition.convertApiMealToAppMeal(response);
    } catch (error) {
      console.error('Update meal failed:', error);
      throw error;
    }
  },

  async deleteMeal(mealId: string): Promise<void> {
    try {
      await apiServiceManager.nutrition.deleteMeal(mealId);
    } catch (error) {
      console.error('Delete meal failed:', error);
      throw error;
    }
  },

  async searchFoods(query: string, limit: number = 20): Promise<any[]> {
    try {
      return await apiServiceManager.nutrition.searchFoods(query, limit);
    } catch (error) {
      console.error('Search foods failed:', error);
      throw error;
    }
  },

  async lookupBarcode(barcode: string): Promise<any> {
    try {
      return await apiServiceManager.nutrition.lookupBarcode(barcode);
    } catch (error) {
      console.error('Lookup barcode failed:', error);
      throw error;
    }
  },

  async getDailyTotals(date: Date): Promise<any> {
    try {
      const dateString = apiServiceManager.nutrition.formatDateForApi(date);
      return await apiServiceManager.nutrition.getDailyTotals(dateString);
    } catch (error) {
      console.error('Get daily totals failed:', error);
      throw error;
    }
  },
};

/**
 * Integrated Workout Service
 * Uses FastAPI backend for all workout operations
 */
export const workoutService = {
  async getWorkouts(date?: Date): Promise<Workout[]> {
    try {
      const dateFilter = date ? apiServiceManager.workout.formatDateForApi(date) : undefined;
      const response = await apiServiceManager.workout.getWorkouts({ date_filter: dateFilter });
      return response.workouts.map(apiWorkout => apiServiceManager.workout.convertApiWorkoutToAppWorkout(apiWorkout));
    } catch (error) {
      console.error('Get workouts failed:', error);
      throw error;
    }
  },

  async addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    try {
      const apiWorkoutData = apiServiceManager.workout.convertAppWorkoutToApiFormat(workout);
      const response = await apiServiceManager.workout.createWorkout(apiWorkoutData);
      return apiServiceManager.workout.convertApiWorkoutToAppWorkout(response);
    } catch (error) {
      console.error('Add workout failed:', error);
      throw error;
    }
  },

  async updateWorkout(workout: Workout): Promise<Workout> {
    try {
      const apiWorkoutData = apiServiceManager.workout.convertAppWorkoutToApiFormat(workout);
      const response = await apiServiceManager.workout.updateWorkout(workout.id, apiWorkoutData);
      return apiServiceManager.workout.convertApiWorkoutToAppWorkout(response);
    } catch (error) {
      console.error('Update workout failed:', error);
      throw error;
    }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await apiServiceManager.workout.deleteWorkout(workoutId);
    } catch (error) {
      console.error('Delete workout failed:', error);
      throw error;
    }
  },

  async getWorkoutStreak(): Promise<any> {
    try {
      return await apiServiceManager.workout.getWorkoutStreak();
    } catch (error) {
      console.error('Get workout streak failed:', error);
      throw error;
    }
  },

  async getWorkoutStats(days: number = 30): Promise<any> {
    try {
      return await apiServiceManager.workout.getWorkoutStats(days);
    } catch (error) {
      console.error('Get workout stats failed:', error);
      throw error;
    }
  },
};

// Initialize API service manager
apiServiceManager.initialize().catch(console.error);