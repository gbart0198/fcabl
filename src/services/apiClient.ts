/**
 * HTTP client for API requests
 * Provides type-safe HTTP methods with consistent error handling
 * Handles the backend's response format: {"data": ...} for success, {"error": "..."} for errors
 */

import { config } from './config';

/**
 * API response wrapper for successful responses
 */
interface ApiSuccessResponse<T> {
  data: T;
}

/**
 * API response wrapper for error responses
 */
interface ApiErrorResponse {
  error: string;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Build query string from parameters object
 * @param params - Object with key-value pairs for query parameters
 * @returns Query string (e.g., "?id=123&name=test") or empty string
 */
function buildQueryString(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Make an HTTP request and handle the response
 * @param url - Full URL or path (will be prefixed with base URL if path)
 * @param options - Fetch options
 * @returns Promise resolving to the typed response data
 * @throws ApiError with the error message from backend
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${config.apiBaseUrl}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      credentials: 'include', // Send cookies with requests for HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Parse response body
    const contentType = response.headers.get('content-type');
    let body: ApiSuccessResponse<T> | ApiErrorResponse;
    
    if (contentType?.includes('application/json')) {
      body = await response.json();
    } else {
      throw new ApiError('Invalid response format from server', response.status);
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = (body as ApiErrorResponse).error || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status);
    }

    // Check if response has error field (backend error)
    if ('error' in body) {
      throw new ApiError(body.error, response.status);
    }

    // Extract data from success response
    if ('data' in body) {
      return body.data;
    }

    // If no data field, return the whole body (shouldn't happen with backend format)
    return body as unknown as T;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(`Network error: Unable to connect to ${fullUrl}`);
    }

    // Handle other errors
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

/**
 * HTTP client with type-safe methods
 */
export const apiClient = {
  /**
   * Perform a GET request
   * @param path - API path (e.g., "/api/user/list")
   * @param params - Optional query parameters
   * @returns Promise resolving to typed response data
   */
  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
    const queryString = buildQueryString(params);
    return request<T>(`${path}${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Perform a POST request
   * @param path - API path
   * @param body - Request body (will be JSON stringified)
   * @returns Promise resolving to typed response data
   */
  async post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Perform a PUT request
   * @param path - API path
   * @param body - Request body (will be JSON stringified)
   * @returns Promise resolving to typed response data
   */
  async put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Perform a PATCH request
   * @param path - API path
   * @param body - Request body (will be JSON stringified)
   * @returns Promise resolving to typed response data
   */
  async patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Perform a DELETE request
   * @param path - API path (including path parameters)
   * @returns Promise resolving to typed response data
   */
  async delete<T>(path: string): Promise<T> {
    return request<T>(path, {
      method: 'DELETE',
    });
  },
};
