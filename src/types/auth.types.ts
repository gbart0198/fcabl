/**
 * User authentication and profile types
 */

/**
 * User account from backend
 * Matches backend User model exactly (1:1 mapping with JSON tags)
 * Maps to: backend/internal/repository/models.go User struct
 * 
 * NOTE: passwordHash field is server-side only and never sent to frontend
 */
export interface User {
  /** Unique identifier for the user */
  id: string;                    // json:"id"
  
  /** User's email address */
  email: string;                 // json:"email"
  
  /** User's phone number */
  phoneNumber: string;           // json:"phoneNumber"
  
  /** User's first name */
  firstName: string;             // json:"firstName"
  
  /** User's last name */
  lastName: string;              // json:"lastName"
  
  /** User's role in the system (e.g., 'player', 'admin', 'coach') */
  role: string;                  // json:"role"
  
  /** Timestamp when user was created (ISO 8601 format: "2024-02-10T16:00:00") */
  createdAt: string;             // json:"createdAt"
  
  /** Timestamp when user was last updated (ISO 8601 format: "2024-02-10T16:00:00") */
  updatedAt: string;             // json:"updatedAt"
}

/** Login form credentials */
export interface LoginCredentials {
  /** Email or username */
  email: string;
  /** User password */
  password: string;
  /** Whether to persist the login session */
  rememberMe?: boolean;
}

/** Registration form data */
export interface RegisterData {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's phone number */
  phoneNumber: string;
  /** User's chosen password */
  password: string;
  /** Password confirmation for validation */
  confirmPassword: string;
  /** User agreement to terms and conditions */
  agreeToTerms: boolean;
}

/** API response for authentication operations */
export interface AuthResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** JWT token if authentication succeeded */
  token?: string;
  /** User data if authentication succeeded */
  user?: User;
  /** Error message if authentication failed */
  error?: string;
}

/** Current authentication state */
export interface AuthState {
  /** Currently authenticated user */
  user: User | null;
  /** JWT authentication token */
  token: string | null;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
}
