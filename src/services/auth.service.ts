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
      const response = await apiClient.post<{ user: User }>('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      // Cookie is set automatically by backend (HTTP-only)
      return {
        success: true,
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
      const response = await apiClient.post<{ user: User }>('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      // Cookie is set automatically by backend (HTTP-only)
      return {
        success: true,
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
   * Clears HTTP-only cookie via backend
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue anyway to clear local state
    }
  },

  /**
   * Verify the JWT token stored in HTTP-only cookie
   * @returns Promise resolving to user data if token is valid, null otherwise
   */
  async verifyToken(): Promise<User | null> {
    try {
      // Token is sent automatically via HTTP-only cookie
      const user = await apiClient.post<User>('/api/auth/verify');
      return user;
    } catch {
      // Token verification failed
      return null;
    }
  },

  /**
   * Request a password reset email
   * @param email - User's email address
   * @returns Promise resolving to success status
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/auth/password-reset/request', { email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset request failed',
      };
    }
  },

  /**
   * Reset password using token from email
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise resolving to success status
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/auth/password-reset/confirm', { token, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  },
};
