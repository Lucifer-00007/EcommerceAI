// App constants
// Application-wide constants and configuration values

/**
 * API endpoint configuration
 */
export const API_CONFIG = {
  /** Base URL for API requests */
  BASE_URL: typeof window === 'undefined' ? '/api' : '/api',
  /** API version */
  VERSION: 'v1',
  /** Request timeout in milliseconds */
  TIMEOUT: 10000,
  /** Maximum number of retry attempts */
  MAX_RETRIES: 3,
  /** Retry delay in milliseconds */
  RETRY_DELAY: 1000,
} as const;

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  /** Authentication endpoints */
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  /** Product endpoints */
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    CATEGORIES: '/products/categories',
  },
  /** Cart endpoints */
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
  },
  /** Order endpoints */
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  /** User endpoints */
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION = {
  /** Default page number */
  DEFAULT_PAGE: 1,
  /** Default page size */
  DEFAULT_PAGE_SIZE: 12,
  /** Maximum page size */
  MAX_PAGE_SIZE: 100,
  /** Available page size options */
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
} as const;

/**
 * Currency configuration
 */
export const CURRENCY = {
  /** Default currency code */
  DEFAULT_CURRENCY: 'USD',
  /** Currency symbol */
  SYMBOL: '$',
  /** Decimal places */
  DECIMAL_PLACES: 2,
  /** Thousands separator */
  THOUSANDS_SEPARATOR: ',',
  /** Decimal separator */
  DECIMAL_SEPARATOR: '.',
} as const;

/**
 * Image placeholder configuration
 */
const IMAGE_PLACEHOLDERS_BASE_URL = 'https://placehold.co';
const IMAGE_PLACEHOLDERS_DEFAULT_WIDTH = 600;
const IMAGE_PLACEHOLDERS_DEFAULT_HEIGHT = 600;
const IMAGE_PLACEHOLDERS_DEFAULT_BG = '1a1a2e';
const IMAGE_PLACEHOLDERS_DEFAULT_TEXT = 'FFF';

export const IMAGE_PLACEHOLDERS = {
  /** Base URL for placeholder images */
  BASE_URL: IMAGE_PLACEHOLDERS_BASE_URL,
  /** Default image dimensions */
  DEFAULT_WIDTH: IMAGE_PLACEHOLDERS_DEFAULT_WIDTH,
  /** Default height */
  DEFAULT_HEIGHT: IMAGE_PLACEHOLDERS_DEFAULT_HEIGHT,
  /** Default background color */
  DEFAULT_BG: IMAGE_PLACEHOLDERS_DEFAULT_BG,
  /** Default text color */
  DEFAULT_TEXT: IMAGE_PLACEHOLDERS_DEFAULT_TEXT,
  /** Generate placeholder URL */
  generate: (
    width: number = IMAGE_PLACEHOLDERS_DEFAULT_WIDTH,
    height: number = IMAGE_PLACEHOLDERS_DEFAULT_HEIGHT,
    text?: string,
    bg: string = IMAGE_PLACEHOLDERS_DEFAULT_BG,
    textColor: string = IMAGE_PLACEHOLDERS_DEFAULT_TEXT,
  ): string => {
    const url = `${IMAGE_PLACEHOLDERS_BASE_URL}/${width}x${height}/${bg}/${textColor}`;
    return text ? `${url}?text=${encodeURIComponent(text)}` : url;
  },
} as const;

/**
 * Application metadata
 */
export const APP_METADATA = {
  /** Application name */
  NAME: 'EcommerceAI',
  /** Application description */
  DESCRIPTION: 'Modern eCommerce platform powered by AI',
  /** Application version */
  VERSION: '1.0.0',
  /** Application URL */
  URL: 'https://ecommerceai.com',
  /** Support email */
  SUPPORT_EMAIL: 'support@ecommerceai.com',
  /** Contact phone */
  CONTACT_PHONE: '+1 (555) 123-4567',
} as const;

/**
 * Storage keys for localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  /** Authentication token */
  AUTH_TOKEN: 'auth_token',
  /** Refresh token */
  REFRESH_TOKEN: 'refresh_token',
  /** User data */
  USER_DATA: 'user_data',
  /** Cart data */
  CART_DATA: 'cart_data',
  /** Theme preference */
  THEME: 'theme',
  /** Language preference */
  LANGUAGE: 'language',
} as const;

/**
 * Mock API delay configuration
 */
export const MOCK_API_DELAY = {
  /** Minimum delay in milliseconds */
  MIN_DELAY: 500,
  /** Maximum delay in milliseconds */
  MAX_DELAY: 1500,
} as const;

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home',
  'Sports',
  'Books',
  'Beauty',
  'Toys',
] as const;

/**
 * Order status labels
 */
export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const;

/**
 * Order status colors (for UI)
 */
export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

/**
 * Rating configuration
 */
export const RATING = {
  /** Maximum rating value */
  MAX: 5,
  /** Minimum rating value */
  MIN: 1,
  /** Rating step increment */
  STEP: 0.5,
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  /** Email regex pattern */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** Password minimum length */
  PASSWORD_MIN_LENGTH: 8,
  /** Password maximum length */
  PASSWORD_MAX_LENGTH: 128,
  /** Phone number regex pattern (US) */
  PHONE_REGEX: /^\+?[\d\s-()]{10,}$/,
  /** Zip code regex pattern (US) */
  ZIP_CODE_REGEX: /^\d{5}(-\d{4})?$/,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  /** Generic error message */
  GENERIC: 'An unexpected error occurred. Please try again.',
  /** Network error message */
  NETWORK: 'Network error. Please check your connection.',
  /** Unauthorized error message */
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  /** Not found error message */
  NOT_FOUND: 'The requested resource was not found.',
  /** Validation error message */
  VALIDATION: 'Please check your input and try again.',
  /** Server error message */
  SERVER: 'Server error. Please try again later.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  /** Login success message */
  LOGIN: 'Successfully logged in!',
  /** Registration success message */
  REGISTER: 'Account created successfully!',
  /** Logout success message */
  LOGOUT: 'Successfully logged out!',
  /** Cart add success message */
  CART_ADD: 'Item added to cart!',
  /** Cart remove success message */
  CART_REMOVE: 'Item removed from cart!',
  /** Cart update success message */
  CART_UPDATE: 'Cart updated successfully!',
  /** Order create success message */
  ORDER_CREATE: 'Order placed successfully!',
  /** Profile update success message */
  PROFILE_UPDATE: 'Profile updated successfully!',
  /** Password change success message */
  PASSWORD_CHANGE: 'Password changed successfully!',
} as const;

/**
 * Date format options
 */
export const DATE_FORMAT = {
  /** Short date format */
  SHORT: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  } as const,
  /** Long date format */
  LONG: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as const,
  /** Date and time format */
  DATETIME: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  } as const,
} as const;

/**
 * Debounce configuration
 */
export const DEBOUNCE = {
  /** Search input debounce delay in milliseconds */
  SEARCH_INPUT: 300,
  /** API request debounce delay in milliseconds */
  API_REQUEST: 500,
} as const;

/**
 * Toast notification duration
 */
export const TOAST_DURATION = {
  /** Short duration */
  SHORT: 3000,
  /** Medium duration */
  MEDIUM: 5000,
  /** Long duration */
  LONG: 8000,
} as const;
