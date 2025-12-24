import { apiClient, PaginatedResponse } from './apiClient';

export interface UploadedFile {
  file_id: string;
  original_url: string;
  thumbnail_urls: {
    small: string;
    medium: string;
    large: string;
  };
  file_size: number;
  file_type: string;
  width?: number;
  height?: number;
  uploaded_at: string;
}

export interface UploadResponse {
  file_id: string;
  original_url: string;
  thumbnail_urls: {
    small: string;
    medium: string;
    large: string;
  };
  file_size: number;
  file_type: string;
  width?: number;
  height?: number;
  uploaded_at: string;
}

export interface MultipleUploadResponse {
  successful_uploads: UploadResponse[];
  failed_uploads: Array<{
    filename: string;
    error: string;
  }>;
  total_files: number;
  success_count: number;
  failure_count: number;
}

export interface GetFilesResponse {
  files: UploadedFile[];
  total: number;
  has_more: boolean;
  search_params: {
    folder?: string;
    limit: number;
    offset: number;
  };
}

export interface StorageUsage {
  user_id: string;
  total_files: number;
  total_size_bytes: number;
  total_size_mb: number;
  files_by_type: {
    meal: number;
    workout: number;
    avatar: number;
    challenge: number;
  };
  size_by_type: {
    meal: number;
    workout: number;
    avatar: number;
    challenge: number;
  };
  last_updated: string;
}

export interface UploadConfig {
  max_file_size_mb: number;
  allowed_file_types: {
    [mimeType: string]: string[];
  };
  allowed_folders: {
    [folder: string]: string;
  };
  thumbnail_sizes: {
    small: { width: number; height: number };
    medium: { width: number; height: number };
    large: { width: number; height: number };
  };
  max_workout_images: number;
}

export interface BulkDeleteRequest {
  file_ids: string[];
  force_delete?: boolean;
}

export interface BulkDeleteResponse {
  deleted_files: string[];
  failed_deletions: Array<{
    file_id: string;
    error: string;
  }>;
  total_requested: number;
  success_count: number;
  failure_count: number;
}

export class UploadApiService {
  /**
   * Upload meal image
   */
  async uploadMealImage(
    file: File,
    description?: string,
    tags?: string[]
  ): Promise<UploadResponse> {
    const additionalData: Record<string, string> = {};
    
    if (description) {
      additionalData.description = description;
    }
    
    if (tags && tags.length > 0) {
      additionalData.tags = tags.join(',');
    }

    return apiClient.uploadFile<UploadResponse>(
      '/upload/meal-image',
      file,
      additionalData
    );
  }

  /**
   * Upload workout images (up to 4)
   */
  async uploadWorkoutImages(
    files: File[],
    descriptions?: string[],
    tags?: string[][]
  ): Promise<MultipleUploadResponse> {
    const additionalData: Record<string, string> = {};
    
    if (descriptions && descriptions.length > 0) {
      additionalData.descriptions = descriptions.join('|');
    }
    
    if (tags && tags.length > 0) {
      additionalData.tags = tags.map(tagList => tagList.join(',')).join('|');
    }

    return apiClient.uploadFiles<MultipleUploadResponse>(
      '/upload/workout-images',
      files,
      additionalData
    );
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(file: File): Promise<UploadResponse> {
    return apiClient.uploadFile<UploadResponse>('/upload/avatar', file);
  }

  /**
   * Upload challenge image
   */
  async uploadChallengeImage(
    file: File,
    description?: string,
    tags?: string[]
  ): Promise<UploadResponse> {
    const additionalData: Record<string, string> = {};
    
    if (description) {
      additionalData.description = description;
    }
    
    if (tags && tags.length > 0) {
      additionalData.tags = tags.join(',');
    }

    return apiClient.uploadFile<UploadResponse>(
      '/upload/challenge-image',
      file,
      additionalData
    );
  }

  /**
   * Get user files
   */
  async getUserFiles(params?: {
    folder?: 'meal' | 'workout' | 'avatar' | 'challenge';
    limit?: number;
    offset?: number;
  }): Promise<GetFilesResponse> {
    return apiClient.get<GetFilesResponse>('/upload/files', params);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<{ message: string; file_id: string }> {
    return apiClient.delete<{ message: string; file_id: string }>(`/upload/files/${fileId}`);
  }

  /**
   * Bulk delete files
   */
  async bulkDeleteFiles(data: BulkDeleteRequest): Promise<BulkDeleteResponse> {
    return apiClient.post<BulkDeleteResponse>('/upload/files/bulk-delete', data);
  }

  /**
   * Get storage usage statistics
   */
  async getStorageUsage(): Promise<StorageUsage> {
    return apiClient.get<StorageUsage>('/upload/storage/usage');
  }

  /**
   * Get upload configuration
   */
  async getUploadConfig(): Promise<UploadConfig> {
    return apiClient.get<UploadConfig>('/upload/config');
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, config: UploadConfig): { valid: boolean; error?: string } {
    // Check file size
    const maxSizeBytes = config.max_file_size_mb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${config.max_file_size_mb}MB limit`,
      };
    }

    // Check file type
    const allowedTypes = Object.keys(config.allowed_file_types);
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate multiple files for workout upload
   */
  validateWorkoutFiles(files: File[], config: UploadConfig): { valid: boolean; error?: string } {
    if (files.length > config.max_workout_images) {
      return {
        valid: false,
        error: `Maximum ${config.max_workout_images} images allowed per workout`,
      };
    }

    for (const file of files) {
      const validation = this.validateFile(file, config);
      if (!validation.valid) {
        return validation;
      }
    }

    return { valid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  /**
   * Generate thumbnail URL for display
   */
  getThumbnailUrl(file: UploadedFile, size: 'small' | 'medium' | 'large' = 'medium'): string {
    return file.thumbnail_urls[size] || file.original_url;
  }
}

export const uploadApiService = new UploadApiService();