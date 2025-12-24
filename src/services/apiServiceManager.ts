import { API_CONFIG } from '../config/api';
import { apiClient } from './apiClient';
import { authApiService } from './authApiService';
import { nutritionApiService } from './nutritionApiService';
import { workoutApiService } from './workoutApiService';
import { medicineApiService } from './medicineApiServiceNew';
import { analyticsApiService } from './analyticsApiService';
import { uploadApiService } from './uploadApiService';
import { socialApiService } from './socialApiService';
import { challengesApiService } from './challengesApiService';
import { rewardsApiService } from './rewardsApiService';

/**
 * Centralized API Service Manager
 * Provides a single point of access to all API services with configuration management
 */
export class ApiServiceManager {
  private static instance: ApiServiceManager;
  private isInitialized = false;
  private healthCheckInterval?: NodeJS.Timeout;

  // Service instances
  public readonly auth = authApiService;
  public readonly nutrition = nutritionApiService;
  public readonly workout = workoutApiService;
  public readonly medicine = medicineApiService;
  public readonly analytics = analyticsApiService;
  public readonly upload = uploadApiService;
  public readonly social = socialApiService;
  public readonly challenges = challengesApiService;
  public readonly rewards = rewardsApiService;
  public readonly client = apiClient;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ApiServiceManager {
    if (!ApiServiceManager.instance) {
      ApiServiceManager.instance = new ApiServiceManager();
    }
    return ApiServiceManager.instance;
  }

  /**
   * Initialize the API service manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Check API health
      await this.checkApiHealth();
      
      // Start periodic health checks in production
      if (import.meta.env.PROD) {
        this.startHealthChecks();
      }

      this.isInitialized = true;
      
      if (API_CONFIG.DEV.LOG_API_CALLS) {
        console.log('API Service Manager initialized successfully');
        console.log('Configuration:', {
          baseUrl: API_CONFIG.BASE_URL,
          features: API_CONFIG.FEATURES,
        });
      }
    } catch (error) {
      console.error('Failed to initialize API Service Manager:', error);
      console.warn('API may be unavailable - check backend server');
      throw error;
    }
  }

  /**
   * Check API health
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const health = await this.client.healthCheck();
      
      if (API_CONFIG.DEV.LOG_API_CALLS) {
        console.log('API Health Check:', health);
      }
      
      return health.status === 'healthy';
    } catch (error) {
      console.error('API Health Check failed:', error);
      return false;
    }
  }

  /**
   * Get detailed API health information
   */
  async getDetailedHealth(): Promise<any> {
    try {
      return await this.client.detailedHealthCheck();
    } catch (error) {
      console.error('Detailed health check failed:', error);
      return null;
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    // Check every 5 minutes
    this.healthCheckInterval = setInterval(async () => {
      const isHealthy = await this.checkApiHealth();
      
      if (!isHealthy) {
        console.warn('API health check failed - API may be unavailable');
        // Could trigger fallback to mock data or show user notification
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Stop health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  /**
   * Get API configuration
   */
  getConfig() {
    return API_CONFIG;
  }

  /**
   * Check if real API is being used
   */
  isUsingRealApi(): boolean {
    return true; // Always use real API now
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof typeof API_CONFIG.FEATURES): boolean {
    return API_CONFIG.FEATURES[feature];
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      initialized: this.isInitialized,
      usingRealApi: this.isUsingRealApi(),
      baseUrl: API_CONFIG.BASE_URL,
      features: API_CONFIG.FEATURES,
      services: {
        auth: !!this.auth,
        nutrition: !!this.nutrition,
        workout: !!this.workout,
        medicine: !!this.medicine,
        analytics: !!this.analytics,
        upload: !!this.upload,
        social: !!this.social,
        challenges: !!this.challenges,
        rewards: !!this.rewards,
      },
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopHealthChecks();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const apiServiceManager = ApiServiceManager.getInstance();

// Auto-initialize in development
if (import.meta.env.DEV) {
  apiServiceManager.initialize().catch(console.error);
}

export default apiServiceManager;