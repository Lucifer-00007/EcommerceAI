// API type definitions
// TypeScript types for API request/response structures

/**
 * Enumeration of HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

/**
 * Enumeration of order statuses
 */
export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

/**
 * Represents an item in an order
 */
export interface OrderItem {
  /** Unique identifier for the order item */
  readonly id: string;
  /** Product ID */
  readonly productId: string;
  /** Product name at time of order */
  readonly productName: string;
  /** Product image at time of order */
  readonly productImage: string;
  /** Quantity ordered */
  readonly quantity: number;
  /** Price per unit at time of order */
  readonly price: number;
  /** Total price for this item (quantity * price) */
  readonly total: number;
}

/**
 * Represents a shipping address
 */
export interface ShippingAddress {
  /** Recipient name */
  fullName: string;
  /** Street address */
  address: string;
  /** Apartment/suite/unit (optional) */
  apartment?: string;
  /** City */
  city: string;
  /** State/Province */
  state: string;
  /** Postal/ZIP code */
  zipCode: string;
  /** Country */
  country: string;
  /** Phone number */
  phone: string;
}

/**
 * Represents payment method details
 */
export interface PaymentMethod {
  /** Payment method type */
  type: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  /** Last 4 digits of card (if applicable) */
  last4?: string;
  /** Card brand (if applicable) */
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover';
  /** Display name */
  displayName: string;
}

/**
 * Represents an order in the system
 */
export interface Order {
  /** Unique identifier for the order */
  readonly id: string;
  /** ID of the user who placed the order */
  readonly userId: string;
  /** Array of items in the order */
  items: readonly OrderItem[];
  /** Subtotal before discounts and shipping */
  subtotal: number;
  /** Discount amount applied */
  discount: number;
  /** Shipping cost */
  shipping: number;
  /** Tax amount */
  tax: number;
  /** Final total amount */
  total: number;
  /** Current order status */
  status: OrderStatus;
  /** Shipping address */
  shippingAddress: ShippingAddress;
  /** Payment method used */
  paymentMethod: PaymentMethod;
  /** Order notes (optional) */
  notes?: string;
  /** Timestamp when the order was created */
  readonly createdAt: string;
  /** Timestamp when the order was last updated */
  readonly updatedAt: string;
  /** Estimated delivery date (optional) */
  estimatedDelivery?: string;
  /** Actual delivery date (optional) */
  deliveredAt?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  /** Response data (if successful) */
  data?: T;
  /** Error information (if failed) */
  error?: ApiError;
  /** Response message */
  message?: string;
  /** HTTP status code */
  status: HttpStatus;
  /** Timestamp of the response */
  timestamp: string;
}

/**
 * API error details
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** Error code */
  code: string;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Stack trace (development only) */
  stack?: string;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: readonly T[];
  /** Total number of items */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there's a next page */
  hasNext: boolean;
  /** Whether there's a previous page */
  hasPrev: boolean;
}

/**
 * Parameters for creating a new order
 */
export interface CreateOrderInput {
  /** Items to include in the order */
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  /** Shipping address */
  shippingAddress: ShippingAddress;
  /** Payment method */
  paymentMethod: PaymentMethod;
  /** Order notes (optional) */
  notes?: string;
}

/**
 * Parameters for updating an order
 */
export interface UpdateOrderInput {
  /** New order status */
  status?: OrderStatus;
  /** Updated shipping address */
  shippingAddress?: ShippingAddress;
  /** Order notes */
  notes?: string;
}

/**
 * Order summary for display
 */
export interface OrderSummary {
  /** Order ID */
  id: string;
  /** Order date */
  createdAt: string;
  /** Total amount */
  total: number;
  /** Order status */
  status: OrderStatus;
  /** Number of items */
  itemCount: number;
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  /** Request headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * API client interface
 */
export interface ApiClient {
  /** Perform GET request */
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  /** Perform POST request */
  post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  /** Perform PUT request */
  put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  /** Perform PATCH request */
  patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  /** Perform DELETE request */
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
}
