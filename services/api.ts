/**
 * Enhanced API Service
 *
 * Centralized API client with error handling, request/response interceptors,
 * and type safety. Supports both real API and mock data modes.
 *
 * @example
 * const response = await apiRequest<Product[]>('/products');
 * const products = await apiClient.products.getAll();
 */

import { API_CONFIG } from "@/lib/constants";
import type { ApiResponse, ApiError } from "@/types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Request options extending native RequestInit
 */
interface RequestOptions extends RequestInit {
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Whether to skip JSON parsing (for blob responses) */
  raw?: boolean;
}

/**
 * API Client configuration
 */
interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Custom API Error class with status code and data
 */
export class ApiErrorClass extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  /**
   * Check if error is a network/timeout error
   */
  get isNetworkError(): boolean {
    return this.status === 0 || this.status === 408;
  }

  /**
   * Check if error is a client error (4xx)
   */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  get isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }
}

// =============================================================================
// CORE API REQUEST FUNCTION
// =============================================================================

/**
 * Generic API request wrapper with comprehensive error handling
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint (relative to base URL)
 * @param options - Request options including timeout, headers, body
 * @returns Promise resolving to ApiResponse<T>
 *
 * @example
 * const response = await apiRequest<Product[]>('/products');
 * if (response.success) {
 *   console.log(response.data);
 * }
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const { timeout = 10000, raw = false, ...fetchOptions } = options;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle raw responses (blobs, etc.)
    if (raw) {
      const data = (await response.blob()) as unknown as T;
      return {
        success: response.ok,
        data,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }

    // Parse JSON response
    const data = await response.json().catch(() => null);

    // Handle non-OK responses
    if (!response.ok) {
      const errors: ApiError[] = data?.errors || [
        {
          code: `HTTP_${response.status}`,
          message: data?.message || `Request failed with status ${response.status}`,
        },
      ];

      return {
        success: false,
        data: null as unknown as T,
        message: data?.message || "Request failed",
        errors,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }

    // Return successful response
    return {
      success: true,
      data: data?.data ?? data,
      message: data?.message,
      statusCode: response.status,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    let apiError: ApiError;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        apiError = {
          code: "REQUEST_TIMEOUT",
          message: `Request timeout after ${timeout}ms`,
        };
      } else if (error.message.includes("fetch")) {
        apiError = {
          code: "NETWORK_ERROR",
          message: "Network error. Please check your connection.",
        };
      } else {
        apiError = {
          code: "UNKNOWN_ERROR",
          message: error.message,
        };
      }
    } else {
      apiError = {
        code: "UNKNOWN_ERROR",
        message: "An unknown error occurred",
      };
    }

    return {
      success: false,
      data: null as unknown as T,
      message: apiError.message,
      errors: [apiError],
      statusCode: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// =============================================================================
// API CLIENT WITH CRUD OPERATIONS
// =============================================================================

/**
 * Enhanced API Client with typed CRUD operations
 *
 * Provides a clean interface for making HTTP requests with automatic
 * JSON parsing, error handling, and timeout support.
 */
export const apiClient = {
  /**
   * Configuration
   */
  config: {
    baseUrl: API_CONFIG.baseUrl,
    timeout: 10000,
  } as ApiClientConfig,

  /**
   * Update client configuration
   */
  setConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  },

  /**
   * Set auth token for authenticated requests
   */
  setAuthToken(token: string | null): void {
    if (token) {
      this.config.headers = {
        ...this.config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      delete this.config.headers?.Authorization;
    }
  },

  /**
   * GET request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "GET",
      headers: { ...this.config.headers, ...options?.headers },
    });
  },

  /**
   * POST request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers: { ...this.config.headers, ...options?.headers },
    });
  },

  /**
   * PUT request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers: { ...this.config.headers, ...options?.headers },
    });
  },

  /**
   * PATCH request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      headers: { ...this.config.headers, ...options?.headers },
    });
  },

  /**
   * DELETE request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "DELETE",
      headers: { ...this.config.headers, ...options?.headers },
    });
  },

  // =============================================================================
  // RESOURCE-SPECIFIC ENDPOINTS
  // =============================================================================

  /**
   * Products API
   */
  products: {
    getAll: <T>() => apiClient.get<T>("/products"),
    getById: <T>(id: string) => apiClient.get<T>(`/products/${id}`),
    getBySlug: <T>(slug: string) => apiClient.get<T>(`/products/slug/${slug}`),
    search: <T>(query: string) => apiClient.get<T>(`/products/search?q=${encodeURIComponent(query)}`),
    getCategories: <T>() => apiClient.get<T>("/categories"),
    getCategoryBySlug: <T>(slug: string) => apiClient.get<T>(`/categories/${slug}`),
    getRelated: <T>(id: string) => apiClient.get<T>(`/products/${id}/related`),
  },

  /**
   * Auth API
   */
  auth: {
    login: <T>(credentials: unknown) => apiClient.post<T>("/auth/login", credentials),
    register: <T>(data: unknown) => apiClient.post<T>("/auth/register", data),
    logout: <T>() => apiClient.post<T>("/auth/logout"),
    refresh: <T>() => apiClient.post<T>("/auth/refresh"),
    me: <T>() => apiClient.get<T>("/auth/me"),
    updateProfile: <T>(data: unknown) => apiClient.patch<T>("/auth/profile", data),
  },

  /**
   * Cart API
   */
  cart: {
    get: <T>() => apiClient.get<T>("/cart"),
    addItem: <T>(item: unknown) => apiClient.post<T>("/cart/items", item),
    updateItem: <T>(itemId: string, data: unknown) =>
      apiClient.patch<T>(`/cart/items/${itemId}`, data),
    removeItem: <T>(itemId: string) => apiClient.delete<T>(`/cart/items/${itemId}`),
    clear: <T>() => apiClient.delete<T>("/cart"),
  },

  /**
   * Orders API
   */
  orders: {
    getAll: <T>() => apiClient.get<T>("/orders"),
    getById: <T>(id: string) => apiClient.get<T>(`/orders/${id}`),
    create: <T>(data: unknown) => apiClient.post<T>("/orders", data),
    cancel: <T>(id: string) => apiClient.patch<T>(`/orders/${id}/cancel`, {}),
  },

  /**
   * Reviews API
   */
  reviews: {
    getByProduct: <T>(productId: string) => apiClient.get<T>(`/products/${productId}/reviews`),
    create: <T>(data: unknown) => apiClient.post<T>("/reviews", data),
    markHelpful: <T>(reviewId: string) => apiClient.post<T>(`/reviews/${reviewId}/helpful`, {}),
  },
};

// =============================================================================
// LEGACY API (for backward compatibility)
// =============================================================================

/**
 * Legacy API client using exceptions for error handling
 * @deprecated Use apiClient or apiRequest instead
 */
export const api = {
  /**
   * GET request
   * @deprecated Use apiClient.get instead
   */
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }).then((res) => {
      if (!res.success) {
        throw new ApiErrorClass(
          res.message || "Request failed",
          res.statusCode || 500,
          res.errors
        );
      }
      return res.data;
    }),

  /**
   * POST request
   * @deprecated Use apiClient.post instead
   */
  post: <T>(endpoint: string, data: unknown, options?: RequestOptions): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.success) {
        throw new ApiErrorClass(
          res.message || "Request failed",
          res.statusCode || 500,
          res.errors
        );
      }
      return res.data;
    }),

  /**
   * PUT request
   * @deprecated Use apiClient.put instead
   */
  put: <T>(endpoint: string, data: unknown, options?: RequestOptions): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.success) {
        throw new ApiErrorClass(
          res.message || "Request failed",
          res.statusCode || 500,
          res.errors
        );
      }
      return res.data;
    }),

  /**
   * PATCH request
   * @deprecated Use apiClient.patch instead
   */
  patch: <T>(endpoint: string, data: unknown, options?: RequestOptions): Promise<T> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.success) {
        throw new ApiErrorClass(
          res.message || "Request failed",
          res.statusCode || 500,
          res.errors
        );
      }
      return res.data;
    }),

  /**
   * DELETE request
   * @deprecated Use apiClient.delete instead
   */
  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }).then((res) => {
      if (!res.success) {
        throw new ApiErrorClass(
          res.message || "Request failed",
          res.statusCode || 500,
          res.errors
        );
      }
      return res.data;
    }),
};

// =============================================================================
// EXPORTS
// =============================================================================

export type { RequestOptions, ApiClientConfig };
export default apiClient;
