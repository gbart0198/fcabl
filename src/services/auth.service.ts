/**
 * Authentication API service
 * Handles user authentication operations
 */

import { apiClient } from './apiClient';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';

/**
 * Authentication service for login, register, and logout operations
 */
export const authService = {
  /**
   * Login with email and password
   * @param credentials - User login credentials
   * @returns Promise resolving to authentication response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{ token: string; user: User }>('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      // Store token and user in localStorage if rememberMe is true
      if (credentials.rememberMe) {
        localStorage.setItem('fcabl_token', response.token);
        localStorage.setItem('fcabl_user', JSON.stringify(response.user));
      }

      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  /**
   * Register a new user account
   * @param data - User registration data
   * @returns Promise resolving to authentication response
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{ token: string; user: User }>('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      // Store token and user in localStorage
      localStorage.setItem('fcabl_token', response.token);
      localStorage.setItem('fcabl_user', JSON.stringify(response.user));

      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  },

  /**
   * Logout the current user
   * Clears stored authentication data
   */
  async logout(): Promise<void> {
    // Could call backend logout endpoint if needed
    // await apiClient.post('/api/auth/logout');
    
    // Clear local storage
    localStorage.removeItem('fcabl_token');
    localStorage.removeItem('fcabl_user');
  },

  /**
   * Verify a JWT token
   * @param token - JWT token to verify
   * @returns Promise resolving to user data if token is valid, null otherwise
   */
  async verifyToken(token: string): Promise<User | null> {
    try {
      const user = await apiClient.post<User>('/api/auth/verify', { token });
      return user;
    } catch {
      // Token verification failed, clear local storage
      localStorage.removeItem('fcabl_token');
      localStorage.removeItem('fcabl_user');
      return null;
    }
  },
};
