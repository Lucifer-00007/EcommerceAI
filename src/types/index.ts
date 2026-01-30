/**
 * Core type definitions for the eCommerce application
 * 
 * These types define the shape of data throughout the application,
 * ensuring type safety and consistent data structures.
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

/**
 * Represents a product category
 */
export interface Category {
  /** Unique identifier for the category */
  id: string
  /** Display name of the category */
  name: string
  /** URL-friendly slug for the category */
  slug: string
  /** Optional description of the category */
  description?: string
  /** URL to category image */
  image?: string
  /** Number of products in this category */
  productCount?: number
}

/**
 * Represents a product review/rating
 */
export interface Review {
  /** Unique identifier for the review */
  id: string
  /** ID of the product being reviewed */
  productId: string
  /** ID of the user who wrote the review */
  userId: string
  /** Name of the reviewer */
  userName: string
  /** Avatar URL of the reviewer */
  userAvatar?: string
  /** Rating from 1-5 */
  rating: number
  /** Review title */
  title?: string
  /** Review content */
  content: string
  /** Date the review was created */
  createdAt: string
  /** Whether the review is verified (purchased product) */
  isVerified: boolean
  /** Number of helpful votes */
  helpfulCount: number
}

/**
 * Represents a product in the catalog
 */
export interface Product {
  /** Unique identifier for the product */
  id: string
  /** Product name */
  name: string
  /** URL-friendly slug */
  slug: string
  /** Product description */
  description: string
  /** Short excerpt for previews */
  shortDescription?: string
  /** Current price */
  price: number
  /** Original price (if on sale) */
  originalPrice?: number
  /** Product images */
  images: string[]
  /** Main product image */
  image: string
  /** Product category */
  category: Category
  /** Category ID for filtering */
  categoryId: string
  /** Product tags */
  tags: string[]
  /** Average rating (1-5) */
  rating: number
  /** Total number of reviews */
  reviewCount: number
  /** Product reviews */
  reviews?: Review[]
  /** Stock quantity available */
  stockQuantity: number
  /** Whether the product is in stock */
  inStock: boolean
  /** SKU (Stock Keeping Unit) */
  sku: string
  /** Product specifications/key-value pairs */
  specifications?: Record<string, string>
  /** Product weight in kg */
  weight?: number
  /** Product dimensions */
  dimensions?: {
    length: number
    width: number
    height: number
  }
  /** Date product was added */
  createdAt: string
  /** Date product was last updated */
  updatedAt: string
  /** Whether product is featured */
  isFeatured: boolean
  /** Whether product is on sale */
  isOnSale: boolean
}

// ============================================================================
// CART TYPES
// ============================================================================

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  /** Unique identifier for the cart item */
  id: string
  /** The product in the cart */
  product: Product
  /** Quantity of this product */
  quantity: number
  /** Price at time of adding to cart */
  priceAtAdd: number
}

/**
 * Represents the shopping cart state
 */
export interface Cart {
  /** Array of cart items */
  items: CartItem[]
  /** Unique cart identifier */
  id: string
  /** User ID (if logged in) */
  userId?: string
  /** Date cart was created */
  createdAt: string
  /** Date cart was last updated */
  updatedAt: string
}

/**
 * Calculated cart totals
 */
export interface CartTotals {
  /** Total number of items in cart */
  itemCount: number
  /** Total quantity of all items */
  totalQuantity: number
  /** Subtotal before discounts/tax */
  subtotal: number
  /** Total discount amount */
  discount: number
  /** Tax amount */
  tax: number
  /** Shipping cost */
  shipping: number
  /** Final total */
  total: number
}

// ============================================================================
// USER TYPES
// ============================================================================

/**
 * User roles for authorization
 */
export type UserRole = 'customer' | 'admin' | 'moderator'

/**
 * Represents a user in the system
 */
export interface User {
  /** Unique identifier */
  id: string
  /** User's email address */
  email: string
  /** User's full name */
  name: string
  /** User's first name */
  firstName?: string
  /** User's last name */
  lastName?: string
  /** User's avatar URL */
  avatar?: string
  /** User's phone number */
  phone?: string
  /** User's role */
  role: UserRole
  /** Whether email is verified */
  emailVerified: boolean
  /** Date user joined */
  createdAt: string
  /** Date user was last updated */
  updatedAt: string
}

/**
 * User profile for editing
 */
export interface UserProfile {
  name: string
  email: string
  phone?: string
  avatar?: string
}

/**
 * User address for shipping/billing
 */
export interface Address {
  /** Unique identifier */
  id: string
  /** Address label (e.g., "Home", "Work") */
  label?: string
  /** Recipient name */
  name: string
  /** Street address line 1 */
  street1: string
  /** Street address line 2 */
  street2?: string
  /** City */
  city: string
  /** State/Province */
  state: string
  /** Postal/ZIP code */
  postalCode: string
  /** Country */
  country: string
  /** Phone number for delivery */
  phone?: string
  /** Whether this is the default address */
  isDefault: boolean
}

// ============================================================================
// ORDER TYPES
// ============================================================================

/**
 * Order status enum
 */
export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

/**
 * Payment status enum
 */
export type PaymentStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled'

/**
 * Represents an item in an order
 */
export interface OrderItem {
  /** Unique identifier */
  id: string
  /** Product ID */
  productId: string
  /** Product name at time of order */
  productName: string
  /** Product image */
  productImage: string
  /** Quantity ordered */
  quantity: number
  /** Price per unit at time of order */
  unitPrice: number
  /** Total for this item */
  total: number
}

/**
 * Represents a customer order
 */
export interface Order {
  /** Unique order identifier */
  id: string
  /** Order number (human-readable) */
  orderNumber: string
  /** User who placed the order */
  userId: string
  /** Order items */
  items: OrderItem[]
  /** Shipping address */
  shippingAddress: Address
  /** Billing address */
  billingAddress: Address
  /** Order status */
  status: OrderStatus
  /** Payment status */
  paymentStatus: PaymentStatus
  /** Payment method used */
  paymentMethod: string
  /** Subtotal amount */
  subtotal: number
  /** Shipping cost */
  shipping: number
  /** Tax amount */
  tax: number
  /** Discount applied */
  discount: number
  /** Final total */
  total: number
  /** Order notes */
  notes?: string
  /** Tracking number (if shipped) */
  trackingNumber?: string
  /** Date order was placed */
  createdAt: string
  /** Date order was last updated */
  updatedAt: string
  /** Estimated delivery date */
  estimatedDelivery?: string
  /** Actual delivery date */
  deliveredAt?: string
}

// ============================================================================
// AUTH TYPES
// ============================================================================

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

/**
 * Authentication state
 */
export interface AuthState {
  /** Current user (null if not logged in) */
  user: User | null
  /** JWT access token */
  accessToken: string | null
  /** Refresh token */
  refreshToken: string | null
  /** Whether auth state is being loaded */
  isLoading: boolean
  /** Whether user is authenticated */
  isAuthenticated: boolean
}

// ============================================================================
// FILTER & PAGINATION TYPES
// ============================================================================

/**
 * Product filter options
 */
export interface ProductFilters {
  /** Search query */
  search?: string
  /** Category ID filter */
  category?: string
  /** Minimum price */
  minPrice?: number
  /** Maximum price */
  maxPrice?: number
  /** Minimum rating */
  minRating?: number
  /** Tags to filter by */
  tags?: string[]
  /** Only show in-stock items */
  inStock?: boolean
  /** Only show on-sale items */
  onSale?: boolean
  /** Only show featured items */
  featured?: boolean
}

/**
 * Sort options for products
 */
export type ProductSortOption = 
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name-asc'
  | 'name-desc'

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page: number
  /** Items per page */
  limit: number
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  data: T[]
  /** Total number of items */
  total: number
  /** Current page */
  page: number
  /** Items per page */
  limit: number
  /** Total number of pages */
  totalPages: number
  /** Whether there is a next page */
  hasNextPage: boolean
  /** Whether there is a previous page */
  hasPrevPage: boolean
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean
  /** Response data */
  data?: T
  /** Error message (if not successful) */
  error?: string
  /** Error details */
  errors?: Record<string, string[]>
  /** Response message */
  message?: string
}

/**
 * API error structure
 */
export interface ApiError {
  /** Error message */
  message: string
  /** HTTP status code */
  statusCode: number
  /** Error code for programmatic handling */
  code?: string
  /** Field-specific errors */
  errors?: Record<string, string[]>
}

// ============================================================================
// UI/UX TYPES
// ============================================================================

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * Toast notification
 */
export interface Toast {
  /** Unique identifier */
  id: string
  /** Toast type */
  type: ToastType
  /** Toast message */
  message: string
  /** Optional title */
  title?: string
  /** Auto-dismiss duration (ms) */
  duration?: number
  /** Whether toast can be dismissed manually */
  dismissible?: boolean
}

/**
 * Modal state
 */
export interface ModalState {
  /** Whether modal is open */
  isOpen: boolean
  /** Modal content ID */
  contentId?: string
  /** Modal data */
  data?: unknown
}

// ============================================================================
// CHECKOUT TYPES
// ============================================================================

/**
 * Shipping method
 */
export interface ShippingMethod {
  /** Unique identifier */
  id: string
  /** Method name */
  name: string
  /** Method description */
  description: string
  /** Delivery time estimate */
  estimatedDays: string
  /** Cost */
  cost: number
}

/**
 * Payment method
 */
export interface PaymentMethod {
  /** Unique identifier */
  id: string
  /** Method type */
  type: 'credit_card' | 'paypal' | 'bank_transfer'
  /** Display name */
  name: string
  /** Last 4 digits (for cards) */
  last4?: string
  /** Expiry date (for cards) */
  expiryDate?: string
  /** Whether this is the default method */
  isDefault: boolean
}

/**
 * Checkout form data
 */
export interface CheckoutFormData {
  /** Shipping address */
  shippingAddress: Omit<Address, 'id' | 'isDefault'>
  /** Billing address (if different) */
  billingAddress?: Omit<Address, 'id' | 'isDefault'>
  /** Whether billing is same as shipping */
  sameAsShipping: boolean
  /** Shipping method ID */
  shippingMethod: string
  /** Payment method ID */
  paymentMethod: string
  /** Order notes */
  notes?: string
}
