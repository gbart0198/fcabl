/**
 * Payment types
 * Maps to: backend/internal/repository/models.go Payment struct
 */

/**
 * Player payment record
 * Matches backend Payment model exactly (1:1 mapping with JSON tags)
 */
export interface Payment {
  /** Unique identifier for the payment */
  id: string;                    // json:"id"
  
  /** ID of the player who made this payment */
  playerId: string;              // json:"playerId"
  
  /** Stripe payment ID for tracking */
  stripeId: string;              // json:"stripeId"
  
  /** Payment amount (decimal number, e.g., 25.00) */
  amount: number;                // json:"amount"
  
  /** Payment status (e.g., 'pending', 'completed', 'failed') */
  status: string;                // json:"status"
  
  /** Timestamp when payment was made (ISO 8601 format: "2024-02-10T16:00:00") */
  paymentDate: string;           // json:"paymentDate"
}
