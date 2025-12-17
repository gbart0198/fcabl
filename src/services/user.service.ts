/**
 * User API service
 * Handles all user-related API calls
 */

import { apiClient } from './apiClient';
import type { User } from '@/types/auth.types';

/**
 * Parameters for getting a user
 * Can query by id or email
 */
export interface GetUserParams extends Record<string, string | undefined> {
  id?: string;
  email?: string;
}

/**
 * Data for creating a new user
 */
export interface CreateUserData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

/**
 * Data for updating an existing user
 */
export interface UpdateUserData {
  id: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/**
 * User service for managing user accounts
 */
export const userService = {
  /**
   * Get a list of all users
   * @returns Promise resolving to array of users
   */
  async listUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/api/user/list');
  },

  /**
   * Get a single user by id or email
   * @param params - Query parameters (id or email)
   * @returns Promise resolving to user
   */
  async getUser(params: GetUserParams): Promise<User> {
    return apiClient.get<User>('/api/user', params);
  },

  /**
   * Create a new user
   * @param data - User creation data
   * @returns Promise resolving to created user
   */
  async createUser(data: CreateUserData): Promise<User> {
    return apiClient.post<User>('/api/user', data);
  },

  /**
   * Update an existing user
   * @param data - User update data (must include id)
   * @returns Promise resolving to updated user
   */
  async updateUser(data: UpdateUserData): Promise<User> {
    return apiClient.put<User>('/api/user', data);
  },

  /**
   * Delete a user
   * @param id - User ID
   * @returns Promise resolving to success confirmation
   */
  async deleteUser(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/user/${id}`);
  },
};
