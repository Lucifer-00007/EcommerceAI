// API client abstraction
// Centralized API client for making HTTP requests

import type {
  ApiResponse,
  ApiRequestConfig,
  ApiClient,
  ApiError,
  HttpStatus,
} from '@/types/api.types';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Loading state manager for API requests
 */
class LoadingManager {
  private loadingStates = new Map<string, boolean>();
  private listeners = new Set<(key: string, isLoading: boolean) => void>();

  /**
   * Set loading state for a key
   * @param key Unique identifier for the request
   * @param isLoading Loading state
   */
  setLoading(key: string, isLoading: boolean): void {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners(key, isLoading);
  }

  /**
   * Get loading state for a key
   * @param key Unique identifier for the request
   * @returns Loading state
   */
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  /**
   * Subscribe to loading state changes
   * @param listener Callback function
   * @returns Unsubscribe function
   */
  subscribe(listener: (key: string, isLoading: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of loading state change
   * @param key Unique identifier for the request
   * @param isLoading Loading state
   */
  private notifyListeners(key: string, isLoading: boolean): void {
    this.listeners.forEach((listener) => listener(key, isLoading));
  }

  /**
   * Clear all loading states
   */
  clear(): void {
    this.loadingStates.clear();
  }
}

/**
 * Global loading manager instance
 */
export const loadingManager = new LoadingManager();

/**
 * Create an API error object
 * @param message Error message
 * @param code Error code
 * @param status HTTP status code
 * @param details Additional error details
 * @returns ApiError object
 */
function createApiError(
  message: string,
  code: string,
  _status: HttpStatus,
  details?: Record<string, unknown>,
): ApiError {
  const isDevelopment = typeof window !== 'undefined' && (window as any).__DEV__ !== false;
  return {
    message,
    code,
    details,
    stack: isDevelopment ? new Error().stack : undefined,
  };
}

/**
 * Build query string from parameters
 * @param params Query parameters
 * @returns Query string
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * Get authentication token from storage
 * @returns Auth token or undefined
 */
function getAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || undefined;
}

/**
 * Get refresh token from storage
 * @returns Refresh token or undefined
 */
function getRefreshToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || undefined;
}

/**
 * Set authentication token in storage
 * @param token Auth token
 */
function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Set refresh token in storage
 * @param token Refresh token
 */
function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

/**
 * Clear authentication tokens from storage
 */
function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Request interceptor - called before request is sent
 * @param config Request configuration
 * @returns Modified request configuration
 */
async function requestInterceptor(config: ApiRequestConfig): Promise<ApiRequestConfig> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // Add authentication header if token exists
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    ...config,
    headers,
  };
}

/**
 * Response interceptor - called after response is received
 * @param response Fetch response
 * @returns Processed response data
 */
async function responseInterceptor(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

/**
 * Error interceptor - called when request fails
 * @param error Error object
 * @returns Processed error
 */
async function errorInterceptor(error: unknown): Promise<ApiError> {
  if (error instanceof Response) {
    let message = ERROR_MESSAGES.GENERIC;
    let code = 'UNKNOWN_ERROR';
    let details: Record<string, unknown> | undefined;

    try {
      const data = await error.json();
      message = data.message || message;
      code = data.code || code;
      details = data.details;
    } catch {
      // If parsing fails, use default error message
    }

    return createApiError(message, code, error.status as HttpStatus, details);
  }

  if (error instanceof Error) {
    return createApiError(error.message, 'CLIENT_ERROR', 500);
  }

  return createApiError(ERROR_MESSAGES.GENERIC, 'UNKNOWN_ERROR', 500);
}

/**
 * Retry a failed request
 * @param fn Request function
 * @param retries Number of retries remaining
 * @param delay Delay between retries in milliseconds
 * @returns Promise that resolves with the result
 */
async function retryRequest<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

/**
 * Create a timeout promise
 * @param timeout Timeout in milliseconds
 * @returns Promise that rejects after timeout
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Build full URL with query parameters
 * @param url Base URL
 * @param params Query parameters
 * @returns Full URL with query string
 */
function buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
  const baseUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
  if (!params) return baseUrl;

  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Perform HTTP request with error handling and retry logic
 * @param method HTTP method
 * @param url Request URL
 * @param config Request configuration
 * @param body Request body data
 * @returns Promise that resolves with API response
 */
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  config: ApiRequestConfig = {},
  body?: unknown,
): Promise<ApiResponse<T>> {
  const loadingKey = `${method}:${url}`;
  const startTime = Date.now();

  try {
    // Set loading state
    loadingManager.setLoading(loadingKey, true);

    // Apply request interceptor
    const processedConfig = await requestInterceptor(config);

    // Build full URL
    const fullUrl = buildUrl(url, config.params);

    // Prepare request options
    const options: RequestInit = {
      method,
      headers: processedConfig.headers,
      credentials: processedConfig.withCredentials ? 'include' : 'same-origin',
    };

    // Add body for non-GET requests
    if (method !== 'GET' && body !== undefined) {
      options.body = JSON.stringify(body);
    }

    // Create request with timeout
    const timeout = config.timeout || API_CONFIG.TIMEOUT;
    const requestPromise = fetch(fullUrl, options);

    // Race between request and timeout
    const response = await Promise.race([
      requestPromise,
      createTimeoutPromise(timeout),
    ]);

    // Process response
    const data = await responseInterceptor(response);

    // Check for HTTP errors
    if (!response.ok) {
      const error = await errorInterceptor(response);
      return {
        error,
        status: response.status as HttpStatus,
        timestamp: new Date().toISOString(),
      };
    }

    // Return successful response
    return {
      data: data as T,
      status: response.status as HttpStatus,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Process error
    const apiError = await errorInterceptor(error);

    // Retry on network errors or 5xx errors
    if (
      apiError.code === 'NETWORK_ERROR' ||
      (apiError.details?.status as number) >= 500
    ) {
      try {
        const result = await retryRequest(
          () => request(method, url, config, body),
          API_CONFIG.MAX_RETRIES - 1,
          API_CONFIG.RETRY_DELAY,
        );
        return result as ApiResponse<T>;
      } catch {
        // Retry failed, return original error
      }
    }

    return {
      error: apiError,
      status: 500,
      timestamp: new Date().toISOString(),
    };
  } finally {
    // Clear loading state
    loadingManager.setLoading(loadingKey, false);

    // Log request duration in development
    const isDevelopment = typeof window !== 'undefined' && (window as any).__DEV__ !== false;
    if (isDevelopment) {
      const duration = Date.now() - startTime;
      console.log(`[API] ${method} ${url} - ${duration}ms`);
    }
  }
}

/**
 * API client implementation
 */
export const apiClient: ApiClient = {
  /**
   * Perform GET request
   * @param url Request URL
   * @param config Request configuration
   * @returns Promise that resolves with API response
   */
  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request('GET', url, config);
  },

  /**
   * Perform POST request
   * @param url Request URL
   * @param data Request body data
   * @param config Request configuration
   * @returns Promise that resolves with API response
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request('POST', url, config, data);
  },

  /**
   * Perform PUT request
   * @param url Request URL
   * @param data Request body data
   * @param config Request configuration
   * @returns Promise that resolves with API response
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request('PUT', url, config, data);
  },

  /**
   * Perform PATCH request
   * @param url Request URL
   * @param data Request body data
   * @param config Request configuration
   * @returns Promise that resolves with API response
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request('PATCH', url, config, data);
  },

  /**
   * Perform DELETE request
   * @param url Request URL
   * @param config Request configuration
   * @returns Promise that resolves with API response
   */
  async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request('DELETE', url, config);
  },
};

/**
 * Authentication utilities
 */
export const authUtils = {
  /**
   * Get current auth token
   * @returns Auth token or undefined
   */
  getToken: getAuthToken,

  /**
   * Get current refresh token
   * @returns Refresh token or undefined
   */
  getRefreshToken,

  /**
   * Set auth token
   * @param token Auth token
   */
  setToken: setAuthToken,

  /**
   * Set refresh token
   * @param token Refresh token
   */
  setRefreshToken,

  /**
   * Clear auth tokens
   */
  clearTokens: clearAuthTokens,

  /**
   * Check if user is authenticated
   * @returns Whether user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};

/**
 * Type-safe API request wrapper
 * @param fn API function to call
 * @returns Promise that resolves with data or throws error
 */
export async function apiRequest<T>(
  fn: () => Promise<ApiResponse<T>>,
): Promise<T> {
  const response = await fn();

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error(ERROR_MESSAGES.GENERIC);
  }

  return response.data;
}

/**
 * Type-safe API request wrapper with optional data
 * @param fn API function to call
 * @returns Promise that resolves with data or undefined
 */
export async function apiRequestOptional<T>(
  fn: () => Promise<ApiResponse<T>>,
): Promise<T | undefined> {
  const response = await fn();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

/**
 * Check if API response is successful
 * @param response API response
 * @returns Whether response is successful
 */
export function isSuccessful<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return !response.error && response.data !== undefined;
}

/**
 * Check if API response has error
 * @param response API response
 * @returns Whether response has error
 */
export function hasError<T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: ApiError } {
  return !!response.error;
}
