/**
 * Application configuration
 * Loads environment variables and provides typed access to config values
 */

/**
 * Application configuration object
 * Pulls values from environment variables with sensible defaults
 */
export const config = {
  /**
   * Base URL for the API server
   * Defaults to localhost:8080 for development
   * Override with VITE_API_BASE_URL environment variable
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
} as const;
