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
  
  /** JWT authentication token */
  const token = ref<string | null>(null);
  
  /** Loading state for async operations */
  const loading = ref(false);
  
  /** Error message from last operation */
  const error = ref<string | null>(null);

  // Computed
  /** Whether a user is currently authenticated */
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  
  /** Current user's full name (computed from firstName + lastName) */
  const userFullName = computed(() => user.value ? getUserFullName(user.value) : '');

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
      
      if (response.success && response.token && response.user) {
        token.value = response.token;
        user.value = response.user;
        
        // Persist to localStorage
        localStorage.setItem('fcabl_token', response.token);
        localStorage.setItem('fcabl_user', JSON.stringify(response.user));
        
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
      
      if (response.success && response.token && response.user) {
        token.value = response.token;
        user.value = response.user;
        
        // Persist to localStorage
        localStorage.setItem('fcabl_token', response.token);
        localStorage.setItem('fcabl_user', JSON.stringify(response.user));
        
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
   * Clears all authentication state and localStorage
   */
  async function logout(): Promise<void> {
    await authService.logout();
    token.value = null;
    user.value = null;
    error.value = null;
  }

  /**
   * Check if user is authenticated on app load
   * Verifies stored token and restores user session
   */
  async function checkAuth(): Promise<void> {
    const storedToken = localStorage.getItem('fcabl_token');
    const storedUser = localStorage.getItem('fcabl_user');
    
    if (storedToken && storedUser) {
      const verifiedUser = await authService.verifyToken(storedToken);
      if (verifiedUser) {
        token.value = storedToken;
        user.value = verifiedUser;
      } else {
        // Invalid token, clear storage
        localStorage.removeItem('fcabl_token');
        localStorage.removeItem('fcabl_user');
      }
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Computed
    isAuthenticated,
    userFullName,
    // Actions
    login,
    register,
    logout,
    checkAuth,
  };
});
