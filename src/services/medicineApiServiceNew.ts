import { apiClient, PaginatedResponse } from './apiClient';

export interface ApiMedicine {
  id: string;
  name: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'tablets' | 'capsules' | 'drops' | 'puffs' | 'units';
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'every_other_day' | 'weekly' | 'monthly' | 'as_needed' | 'custom';
  timing: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'anytime';
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'any_meal';
  timing_offset?: number; // in minutes
  reminder_times: string[]; // Array of HH:MM format times
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  is_active: boolean;
  notes?: string;
  side_effects: string[];
  food_interactions: string[];
  image_url?: string;
  color?: string;
  shape?: string;
  last_taken?: string; // ISO datetime
  missed_doses: number;
  total_doses: number;
  adherence_rate: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateMedicineRequest {
  name: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'tablets' | 'capsules' | 'drops' | 'puffs' | 'units';
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'every_other_day' | 'weekly' | 'monthly' | 'as_needed' | 'custom';
  timing: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'anytime';
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'any_meal';
  timing_offset?: number;
  reminder_times: string[];
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  notes?: string;
  side_effects?: string[];
  food_interactions?: string[];
  image_url?: string;
  color?: string;
  shape?: string;
}

export interface GetMedicinesResponse {
  medicines: ApiMedicine[];
  total: number;
  has_more: boolean;
}

export interface MedicineReminder {
  id: string;
  medicine_id: string;
  medicine_name: string;
  scheduled_time: string; // ISO datetime
  reminder_time: string; // HH:MM format
  status: 'pending' | 'taken' | 'missed' | 'snoozed';
  snooze_count: number;
  notes?: string;
}

export interface MarkReminderTakenRequest {
  taken_at?: string; // ISO datetime
  dosage_taken?: string;
  side_effects_experienced?: string[];
  effectiveness_rating?: number; // 1-5
  notes?: string;
}

export interface MarkReminderMissedRequest {
  notes?: string;
}

export interface SnoozeReminderRequest {
  snooze_minutes: number;
}

export interface MedicineLog {
  id: string;
  medicine_id: string;
  medicine_name: string;
  action: 'taken' | 'missed' | 'snoozed';
  scheduled_time: string;
  actual_time?: string;
  dosage_taken?: string;
  side_effects_experienced?: string[];
  effectiveness_rating?: number;
  notes?: string;
  created_at: string;
}

export interface AdherenceStats {
  total_medicines: number;
  active_medicines: number;
  total_doses_scheduled: number;
  doses_taken: number;
  doses_missed: number;
  overall_adherence_rate: number;
  adherence_by_medicine: Array<{
    medicine_name: string;
    adherence_rate: number;
    doses_taken: number;
    doses_missed: number;
  }>;
  recent_activity: Array<{
    date: string;
    medicines_taken: number;
    medicines_missed: number;
  }>;
}

export class MedicineApiService {
  /**
   * Get medicines with optional filtering
   */
  async getMedicines(params?: {
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<GetMedicinesResponse> {
    return apiClient.get<GetMedicinesResponse>('/medicines', params);
  }

  /**
   * Create a new medicine
   */
  async createMedicine(medicine: CreateMedicineRequest): Promise<ApiMedicine> {
    return apiClient.post<ApiMedicine>('/medicines', medicine);
  }

  /**
   * Update an existing medicine
   */
  async updateMedicine(medicineId: string, updates: Partial<CreateMedicineRequest>): Promise<ApiMedicine> {
    return apiClient.put<ApiMedicine>(`/medicines/${medicineId}`, updates);
  }

  /**
   * Delete (deactivate) a medicine
   */
  async deleteMedicine(medicineId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/medicines/${medicineId}`);
  }

  /**
   * Get upcoming reminders
   */
  async getUpcomingReminders(hoursAhead: number = 24): Promise<MedicineReminder[]> {
    return apiClient.get<MedicineReminder[]>('/medicines/reminders/upcoming', { hours_ahead: hoursAhead });
  }

  /**
   * Mark reminder as taken
   */
  async markReminderTaken(reminderId: string, data: MarkReminderTakenRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/medicines/reminders/${reminderId}/taken`, data);
  }

  /**
   * Mark reminder as missed
   */
  async markReminderMissed(reminderId: string, data: MarkReminderMissedRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/medicines/reminders/${reminderId}/missed`, data);
  }

  /**
   * Snooze reminder
   */
  async snoozeReminder(reminderId: string, data: SnoozeReminderRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/medicines/reminders/${reminderId}/snooze`, data);
  }

  /**
   * Get medicine logs
   */
  async getMedicineLogs(params?: {
    medicine_id?: string;
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<MedicineLog>> {
    const response = await apiClient.get<{
      logs: MedicineLog[];
      total: number;
      has_more: boolean;
    }>('/medicines/logs', params);
    
    return {
      data: response.logs,
      total: response.total,
      has_more: response.has_more,
    };
  }

  /**
   * Get adherence statistics
   */
  async getAdherenceStats(days: number = 30): Promise<AdherenceStats> {
    return apiClient.get<AdherenceStats>('/medicines/stats/adherence', { days });
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

  /**
   * Format time for API (HH:MM)
   */
  formatTimeForApi(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  /**
   * Parse API time string to Date object (today's date with specified time)
   */
  parseApiTime(timeString: string): Date {
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today;
  }
}

export const medicineApiService = new MedicineApiService();