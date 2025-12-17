/**
 * Payment API service
 * Handles all payment-related API calls
 */

import { apiClient } from './apiClient';
import type { Payment } from '@/types/payment.types';

/**
 * Parameters for getting a payment
 * Can query by id or other unique fields
 */
export interface GetPaymentParams extends Record<string, string | undefined> {
  id?: string;
}

/**
 * Parameters for listing payments by player
 */
export interface ListPaymentsByPlayerParams extends Record<string, string | undefined> {
  playerId: string;
}

/**
 * Parameters for listing payments by status
 */
export interface ListPaymentsByStatusParams extends Record<string, string | undefined> {
  status: string;
}

/**
 * Parameters for getting player payment summary
 */
export interface GetPlayerPaymentSummaryParams extends Record<string, string | undefined> {
  playerId: string;
}

/**
 * Payment with player information
 */
export interface PaymentWithPlayer extends Payment {
  playerName?: string;
  playerEmail?: string;
}

/**
 * Player payment summary
 */
export interface PlayerPaymentSummary {
  playerId: string;
  playerName?: string;
  totalPaid: number;
  totalPending: number;
  totalFailed: number;
  paymentHistory: Payment[];
}

/**
 * Data for creating a new payment
 */
export interface CreatePaymentData {
  playerId: string;
  stripeId: string;
  amount: number;
  status: string;
  paymentDate: string;
}

/**
 * Data for updating payment status
 */
export interface UpdatePaymentStatusData {
  id: string;
  status: string;
}

/**
 * Payment service for managing payments
 */
export const paymentService = {
  /**
   * Get a list of all payments
   * @returns Promise resolving to array of payments
   */
  async listPayments(): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/api/payment/list');
  },

  /**
   * Get a list of payments for a specific player
   * @param params - Query parameters (playerId)
   * @returns Promise resolving to array of payments
   */
  async listPaymentsByPlayer(params: ListPaymentsByPlayerParams): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/api/payment/player', params);
  },

  /**
   * Get a list of payments filtered by status
   * @param params - Query parameters (status)
   * @returns Promise resolving to array of payments
   */
  async listPaymentsByStatus(params: ListPaymentsByStatusParams): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/api/payment/status-filter', params);
  },

  /**
   * Get a payment with player information
   * @param params - Query parameters (id)
   * @returns Promise resolving to payment with player data
   */
  async getPaymentWithPlayer(params: GetPaymentParams): Promise<PaymentWithPlayer> {
    return apiClient.get<PaymentWithPlayer>('/api/payment/with-player', params);
  },

  /**
   * Get a list of all payments with player information
   * @returns Promise resolving to array of payments with player data
   */
  async listPaymentsWithPlayerInfo(): Promise<PaymentWithPlayer[]> {
    return apiClient.get<PaymentWithPlayer[]>('/api/payment/list-with-players');
  },

  /**
   * Get player payment summary
   * @param params - Query parameters (playerId)
   * @returns Promise resolving to player payment summary
   */
  async getPlayerPaymentSummary(params: GetPlayerPaymentSummaryParams): Promise<PlayerPaymentSummary> {
    return apiClient.get<PlayerPaymentSummary>('/api/payment/summary', params);
  },

  /**
   * Get a single payment by id
   * @param params - Query parameters (id)
   * @returns Promise resolving to payment
   */
  async getPayment(params: GetPaymentParams): Promise<Payment> {
    return apiClient.get<Payment>('/api/payment', params);
  },

  /**
   * Create a new payment
   * @param data - Payment creation data
   * @returns Promise resolving to created payment
   */
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    return apiClient.post<Payment>('/api/payment', data);
  },

  /**
   * Update payment status
   * @param data - Payment status update data
   * @returns Promise resolving to updated payment
   */
  async updatePaymentStatus(data: UpdatePaymentStatusData): Promise<Payment> {
    return apiClient.patch<Payment>('/api/payment/status', data);
  },

  /**
   * Delete a payment
   * @param id - Payment ID
   * @returns Promise resolving to success confirmation
   */
  async deletePayment(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/payment/${id}`);
  },
};
