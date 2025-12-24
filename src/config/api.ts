// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // API Version
  VERSION: '1.0.0',
  
  // Timeout settings (in milliseconds)
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds for file uploads
    LONG_RUNNING: 60000, // 1 minute for analytics
  },
  
  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_MULTIPLIER: 2,
  },
  
  // Rate limiting
  RATE_LIMIT: {
    AUTH: 10, // requests per minute
    DATA_CREATION: 100, // requests per hour
    DATA_RETRIEVAL: 1000, // requests per hour
    FILE_UPLOAD: 50, // requests per hour
    ANALYTICS: 200, // requests per hour
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  
  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE_MB: 5,
    MAX_WORKOUT_IMAGES: 4,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    THUMBNAIL_SIZES: {
      SMALL: { width: 150, height: 150 },
      MEDIUM: { width: 300, height: 300 },
      LARGE: { width: 600, height: 600 },
    },
  },
  
  // Cache settings
  CACHE: {
    USER_PROFILE: 5 * 60 * 1000, // 5 minutes
    MACRO_TARGETS: 10 * 60 * 1000, // 10 minutes
    ANALYTICS: 15 * 60 * 1000, // 15 minutes
    UPLOAD_CONFIG: 60 * 60 * 1000, // 1 hour
  },
  
  // Feature flags
  FEATURES: {
    USE_REAL_API: true, // Always use real API now
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    ENABLE_FILE_UPLOAD: import.meta.env.VITE_ENABLE_FILE_UPLOAD !== 'false',
    ENABLE_MEDICINE_TRACKING: import.meta.env.VITE_ENABLE_MEDICINE_TRACKING !== 'false',
  },
  
  // Development settings
  DEV: {
    LOG_API_CALLS: import.meta.env.DEV,
    SHOW_API_ERRORS: import.meta.env.DEV,
  },
} as const;

// Environment-specific overrides
if (import.meta.env.PROD) {
  // Production overrides
  API_CONFIG.DEV.LOG_API_CALLS = false;
  API_CONFIG.DEV.SHOW_API_ERRORS = false;
}

// Validation
if (!API_CONFIG.BASE_URL) {
  console.warn('API_CONFIG.BASE_URL is not set, using default localhost');
}

export default API_CONFIG;