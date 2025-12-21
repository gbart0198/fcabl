/**
 * Pinia store for authentication state management
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/api';
import type { User, LoginCredentials, RegisterData } from '@/types/auth.types';
import { getUserFullName } from '@/utils/user';

/**
 * Authentication store
 * Manages user authentication state, login, registration, and logout
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  /** Currently authenticated user */
  const user = ref<User | null>(null);
  
  /** Loading state for async operations */
  const loading = ref(false);
  
  /** Error message from last operation */
  const error = ref<string | null>(null);

  // Computed
  /** Whether a user is currently authenticated */
  const isAuthenticated = computed(() => !!user.value);
  
  /** Current user's full name (computed from firstName + lastName) */
  const userFullName = computed(() => user.value ? getUserFullName(user.value) : '');
  
  /** Whether current user is an admin */
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Actions
  /**
   * Login user with credentials
   * @param credentials - Login credentials (email and password)
   * @returns Promise resolving to true if login successful, false otherwise
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        user.value = response.user;
        return true;
      } else {
        error.value = response.error || 'Login failed';
        return false;
      }
    } catch (e) {
      error.value = 'An error occurred during login';
      console.error('Login error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Register new user
   * @param data - Registration data
   * @returns Promise resolving to true if registration successful, false otherwise
   */
  async function register(data: RegisterData): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.register(data);
      
      if (response.success && response.user) {
        user.value = response.user;
        return true;
      } else {
        error.value = response.error || 'Registration failed';
        return false;
      }
    } catch (e) {
      error.value = 'An error occurred during registration';
      console.error('Registration error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout current user
   * Clears HTTP-only cookie via backend
   */
  async function logout(): Promise<void> {
    await authService.logout();
    user.value = null;
    error.value = null;
  }

  /**
   * Check if user is authenticated on app load
   * Verifies JWT cookie and restores user session
   */
  async function checkAuth(): Promise<void> {
    try {
      const verifiedUser = await authService.verifyToken();
      if (verifiedUser) {
        user.value = verifiedUser;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      user.value = null;
    }
  }

  return {
    // State
    user,
    loading,
    error,
    // Computed
    isAuthenticated,
    userFullName,
    isAdmin,
    // Actions
    login,
    register,
    logout,
    checkAuth,
  };
});
