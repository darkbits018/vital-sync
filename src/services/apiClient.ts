import { auth } from '../firebase';
import { API_CONFIG } from '../config/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  has_more: boolean;
  limit?: number;
  offset?: number;
}

export interface ApiError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
  error_code?: string;
  timestamp?: string;
  path?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    
    if (API_CONFIG.DEV.LOG_API_CALLS) {
      console.log('ApiClient initialized with base URL:', this.baseURL);
    }
  }

  /**
   * Get Firebase ID token for authentication
   */
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Get default headers for API requests
   */
  private async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (API_CONFIG.DEV.LOG_API_CALLS) {
      console.log(`API Response: ${response.status} ${response.url}`);
    }

    if (!response.ok) {
      let errorData: ApiError;
      
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          detail: `HTTP ${response.status}: ${response.statusText}`,
          error_code: 'HTTP_ERROR',
        };
      }

      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - redirect to login or refresh token
        console.error('Unauthorized request - user may need to re-authenticate');
      } else if (response.status === 429) {
        // Rate limited
        console.error('Rate limit exceeded');
      }

      const errorMessage = Array.isArray(errorData.detail) 
        ? errorData.detail.map(e => e.msg).join(', ')
        : errorData.detail;

      if (API_CONFIG.DEV.SHOW_API_ERRORS) {
        console.error('API Error:', errorMessage, errorData);
      }

      throw new Error(errorMessage);
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Invalid JSON response from server');
    }
  }

  /**
   * Make GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>, includeAuth: boolean = true): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = await this.getHeaders(includeAuth);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make POST request
   */
  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make PUT request
   */
  async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make DELETE request
   */
  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Upload file with multipart form data
   */
  async uploadFile<T>(
    endpoint: string, 
    file: File, 
    additionalData?: Record<string, string>,
    includeAuth: boolean = true
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: HeadersInit = {};
    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    // Don't set Content-Type for FormData - let browser set it with boundary

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Upload multiple files
   */
  async uploadFiles<T>(
    endpoint: string, 
    files: File[], 
    additionalData?: Record<string, string>,
    includeAuth: boolean = true
  ): Promise<T> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: HeadersInit = {};
    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.get('/', undefined, false);
  }

  /**
   * Detailed health check
   */
  async detailedHealthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.get('/health', undefined, false);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;