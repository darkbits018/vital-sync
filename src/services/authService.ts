import { AuthUser, LoginCredentials, RegisterData, AuthResponse, PasswordResetRequest, PasswordReset } from '../types/auth';
import { User } from '../types';

const API_BASE_URL = '/api/auth';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

// Mock users database for development
const mockUsers: Array<AuthUser & { password: string }> = [
  {
    id: '1',
    email: 'demo@vitalsync.com',
    name: 'Demo User',
    password: 'password123',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    password: 'password123',
    emailVerified: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  }
];

// Simulate API delay
const simulateApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  }));
  const signature = btoa(`mock_signature_${userId}`);
  return `${header}.${payload}.${signature}`;
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await simulateApiDelay();

    const { email, password } = credentials;

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    // Find user in mock database
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('No account found with this email address');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password');
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const token = generateMockToken(user.id);
    const refreshToken = generateMockToken(`refresh_${user.id}`);

    // Remove password from response
    const { password: _, ...authUser } = user;

    const response: AuthResponse = {
      user: authUser,
      token,
      refreshToken,
    };

    // Store in localStorage
    this.storeAuthData(response);

    return response;
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    await simulateApiDelay(1200);

    const { name, email, password, confirmPassword } = data;

    // Validation
    if (!name.trim()) {
      throw new Error('Name is required');
    }

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser: AuthUser & { password: string } = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name: name.trim(),
      password,
      emailVerified: false, // In real app, would require email verification
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Generate tokens
    const token = generateMockToken(newUser.id);
    const refreshToken = generateMockToken(`refresh_${newUser.id}`);

    // Remove password from response
    const { password: _, ...authUser } = newUser;

    const response: AuthResponse = {
      user: authUser,
      token,
      refreshToken,
    };

    // Store in localStorage
    this.storeAuthData(response);

    return response;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    await simulateApiDelay(300);

    // Clear stored auth data
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // In a real app, you'd also invalidate the token on the server
  }

  /**
   * Get current user from stored data
   */
  static getCurrentUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (!userData) return null;

      const user = JSON.parse(userData);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      user.lastLogin = new Date(user.lastLogin);
      
      return user;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (!token || !user) return false;

    // In a real app, you'd validate the token with the server
    // For now, just check if token exists and is not expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<string> {
    await simulateApiDelay(500);

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const user = this.getCurrentUser();

    if (!refreshToken || !user) {
      throw new Error('No refresh token available');
    }

    // Generate new token
    const newToken = generateMockToken(user.id);
    localStorage.setItem(TOKEN_KEY, newToken);

    return newToken;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await simulateApiDelay(800);

    const { email } = data;

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Don't reveal if email exists for security
      return;
    }

    // In a real app, you'd send a password reset email
    console.log(`Password reset email would be sent to: ${email}`);
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: PasswordReset): Promise<void> {
    await simulateApiDelay(800);

    const { token, password, confirmPassword } = data;

    if (!token) {
      throw new Error('Invalid reset token');
    }

    if (!isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // In a real app, you'd validate the reset token and update the password
    console.log('Password would be reset for user');
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<Pick<AuthUser, 'name' | 'avatar'>>): Promise<AuthUser> {
    await simulateApiDelay(600);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Find user in mock database
    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    const updatedUser = { ...mockUsers[userIndex], ...updates };
    mockUsers[userIndex] = updatedUser;

    // Remove password from response
    const { password: _, ...authUser } = updatedUser;

    // Update stored user data
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));

    return authUser;
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await simulateApiDelay(600);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const user = mockUsers.find(u => u.id === currentUser.id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (!isValidPassword(newPassword)) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Update password
    user.password = newPassword;
  }

  /**
   * Store authentication data in localStorage
   */
  private static storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  }

  /**
   * Convert AuthUser to User (for compatibility with existing app)
   */
  static authUserToUser(authUser: AuthUser): User {
    // Get additional user data from localStorage or use defaults
    const storedUserData = localStorage.getItem('user');
    let additionalData = {};
    
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        additionalData = {
          height: parsed.height || 175,
          weight: parsed.weight || 70,
          age: parsed.age || 25,
          gender: parsed.gender || 'male',
          goal: parsed.goal || 'maintain',
          activityLevel: parsed.activityLevel || 'moderate',
        };
      } catch (error) {
        console.warn('Error parsing stored user data:', error);
      }
    }

    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      height: (additionalData as any).height || 175,
      weight: (additionalData as any).weight || 70,
      age: (additionalData as any).age || 25,
      gender: (additionalData as any).gender || 'male',
      goal: (additionalData as any).goal || 'maintain',
      activityLevel: (additionalData as any).activityLevel || 'moderate',
      createdAt: authUser.createdAt,
    };
  }
}