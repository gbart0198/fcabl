/**
 * User authentication and profile types
 */

/** Represents a user in the system */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role?: 'player' | 'admin' | 'coach';
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
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
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
