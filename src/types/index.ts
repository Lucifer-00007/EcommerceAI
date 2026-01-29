/**
 * E-Commerce Application Type Definitions
 *
 * Comprehensive TypeScript types for the entire eCommerce application.
 * All types are strictly typed with no use of `any`.
 *
 * @module types
 * @example
 * import { Product, User, Cart, Order } from '@/types';
 */

// =============================================================================
// PRODUCT TYPES
// =============================================================================

/**
 * Represents a product image with metadata
 * @example
 * {
 *   url: "https://cdn.example.com/products/shoe-red.jpg",
 *   alt: "Red running shoe - side view",
 *   isPrimary: true
 * }
 */
export interface ProductImage {
  /** URL of the product image */
  readonly url: string;
  /** Alternative text for accessibility and SEO */
  readonly alt: string;
  /** Whether this is the primary/main product image */
  readonly isPrimary?: boolean;
}

/**
 * Represents a product specification (key-value pair)
 * @example
 * { key: "Material", value: "100% Cotton" }
 */
export interface ProductSpec {
  /** Specification category or name */
  readonly key: string;
  /** Specification value */
  readonly value: string;
}

/**
 * Represents a product variant (e.g., different size, color)
 * @example
 * {
 *   id: "var_123",
 *   sku: "SHOE-RED-42",
 *   name: "Red - Size 42",
 *   color: "Red",
 *   size: "42",
 *   price: 89.99,
 *   compareAtPrice: 99.99,
 *   inventory: 15,
 *   images: [{ url: "...", alt: "...", isPrimary: true }]
 * }
 */
export interface ProductVariant {
  /** Unique identifier for the variant */
  readonly id: string;
  /** Stock Keeping Unit - unique product code */
  readonly sku: string;
  /** Display name of the variant */
  readonly name: string;
  /** Color option (if applicable) */
  readonly color?: string;
  /** Size option (if applicable) */
  readonly size?: string;
  /** Material option (if applicable) */
  readonly material?: string;
  /** Variant-specific price (overrides base product price if set) */
  readonly price?: number;
  /** Original price for comparison (sale price calculation) */
  readonly compareAtPrice?: number;
  /** Available inventory for this variant */
  readonly inventory: number;
  /** Variant-specific images */
  readonly images?: ProductImage[];
  /** Additional variant attributes */
  readonly attributes?: Record<string, string>;
}

/**
 * Core Product type representing an item in the catalog
 * @example
 * {
 *   id: "prod_123",
 *   name: "Premium Running Shoes",
 *   slug: "premium-running-shoes",
 *   description: "High-performance running shoes...",
 *   price: 89.99,
 *   compareAtPrice: 99.99,
 *   images: [...],
 *   inventory: 100,
 *   categoryId: "cat_shoes",
 *   tags: ["running", "athletic", "outdoor"],
 *   rating: 4.5,
 *   reviewCount: 128,
 *   specs: [{ key: "Material", value: "Mesh" }],
 *   variants: [...],
 *   isActive: true,
 *   createdAt: "2024-01-15T10:00:00Z",
 *   updatedAt: "2024-01-20T14:30:00Z"
 * }
 */
export interface Product {
  /** Unique product identifier */
  readonly id: string;
  /** Product display name */
  readonly name: string;
  /** URL-friendly identifier for the product */
  readonly slug: string;
  /** Detailed product description (supports HTML) */
  readonly description: string;
  /** Short description for listings and cards */
  readonly shortDescription?: string;
  /** Current selling price */
  readonly price: number;
  /** Original price before discount (for showing savings) */
  readonly compareAtPrice?: number;
  /** Array of product images */
  readonly images: ProductImage[];
  /** Total inventory across all variants */
  readonly inventory: number;
  /** ID of the product's primary category */
  readonly categoryId: string;
  /** IDs of additional categories */
  readonly categoryIds?: string[];
  /** Searchable tags for the product */
  readonly tags: string[];
  /** Average customer rating (0-5) */
  readonly rating: number;
  /** Total number of reviews */
  readonly reviewCount: number;
  /** Product specifications */
  readonly specs: ProductSpec[];
  /** Available product variants */
  readonly variants?: ProductVariant[];
  /** Whether the product is active and visible */
  readonly isActive?: boolean;
  /** Whether the product is featured on homepage */
  readonly isFeatured?: boolean;
  /** Product weight in grams (for shipping calculations) */
  readonly weight?: number;
  /** Product dimensions { width, height, depth } in cm */
  readonly dimensions?: {
    readonly width: number;
    readonly height: number;
    readonly depth: number;
  };
  /** SEO metadata */
  readonly seo?: {
    readonly title?: string;
    readonly description?: string;
    readonly keywords?: string[];
  };
  /** ISO 8601 timestamp of creation */
  readonly createdAt: string;
  /** ISO 8601 timestamp of last update */
  readonly updatedAt: string;
}

/**
 * Represents a product category with hierarchical support
 * @example
 * {
 *   id: "cat_shoes",
 *   name: "Shoes",
 *   slug: "shoes",
 *   description: "Footwear for all occasions",
 *   image: { url: "...", alt: "..." },
 *   parentId: "cat_fashion",
 *   children: [...],
 *   sortOrder: 1
 * }
 */
export interface Category {
  /** Unique category identifier */
  readonly id: string;
  /** Category display name */
  readonly name: string;
  /** URL-friendly identifier */
  readonly slug: string;
  /** Category description */
  readonly description?: string;
  /** Category image for display */
  readonly image?: ProductImage;
  /** ID of parent category (null for root categories) */
  readonly parentId?: string;
  /** Sub-categories */
  readonly children?: Category[];
  /** Display order within parent */
  readonly sortOrder?: number;
  /** Number of products in this category */
  readonly productCount?: number;
  /** Whether category is visible to customers */
  readonly isActive?: boolean;
  /** SEO metadata */
  readonly seo?: {
    readonly title?: string;
    readonly description?: string;
    readonly keywords?: string[];
  };
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

// =============================================================================
// CART TYPES
// =============================================================================

/**
 * Represents an item in the shopping cart
 * @example
 * {
 *   productId: "prod_123",
 *   variantId: "var_456",
 *   quantity: 2,
 *   product: { ...Product },
 *   addedAt: "2024-01-20T10:00:00Z"
 * }
 */
export interface CartItem {
  /** ID of the product */
  readonly productId: string;
  /** ID of the selected variant (if product has variants) */
  readonly variantId?: string;
  /** Quantity of this item in cart */
  quantity: number;
  /** Full product details (denormalized for display) */
  readonly product: Product;
  /** Selected variant details (if applicable) */
  readonly variant?: ProductVariant;
  /** When the item was added to cart */
  readonly addedAt: string;
}

/**
 * Represents the shopping cart with totals
 * @example
 * {
 *   items: [...],
 *   subtotal: 179.98,
 *   tax: 18.00,
 *   shipping: 10.00,
 *   total: 207.98,
 *   itemCount: 2,
 *   currency: "USD"
 * }
 */
export interface Cart {
  /** Items in the cart */
  readonly items: CartItem[];
  /** Sum of all item prices × quantities (before tax/shipping) */
  readonly subtotal: number;
  /** Calculated tax amount */
  readonly tax: number;
  /** Shipping cost */
  readonly shipping: number;
  /** Total amount (subtotal + tax + shipping) */
  readonly total: number;
  /** Total number of items (sum of quantities) */
  readonly itemCount: number;
  /** Currency code (ISO 4217) */
  readonly currency: string;
  /** Coupon/discount code applied */
  readonly couponCode?: string;
  /** Discount amount applied */
  readonly discountAmount?: number;
  /** Unique cart identifier (for guest carts) */
  readonly id?: string;
  /** When the cart was last updated */
  readonly updatedAt?: string;
}

/**
 * Cart state including UI/loading states
 * Used in cart store/context
 */
export interface CartState {
  /** Current cart data */
  cart: Cart;
  /** Whether cart is being loaded from server/storage */
  readonly isLoading: boolean;
  /** Whether an update operation is in progress */
  readonly isUpdating: boolean;
  /** Error message if cart operation failed */
  readonly error: string | null;
  /** Whether the cart mini-panel is open */
  readonly isOpen: boolean;
  /** Recently added item for animation/display */
  readonly lastAddedItem?: CartItem;
}

// =============================================================================
// ORDER TYPES
// =============================================================================

/**
 * Order status union type
 * Represents the various stages of order fulfillment
 */
export type OrderStatus =
  | "pending"      // Order placed, awaiting payment confirmation
  | "processing"   // Payment confirmed, preparing for shipment
  | "shipped"      // Order has been shipped
  | "delivered"    // Order delivered to customer
  | "cancelled"    // Order cancelled by customer or system
  | "refunded";    // Order refunded

/**
 * Payment status union type
 * Represents the payment state of an order
 */
export type PaymentStatus =
  | "pending"      // Awaiting payment
  | "completed"    // Payment successfully processed
  | "failed"       // Payment attempt failed
  | "refunded"     // Payment refunded to customer
  | "partially_refunded"; // Partial refund issued

/**
 * Represents a payment method used for an order
 */
export interface PaymentMethod {
  /** Type of payment used */
  readonly type: "card" | "paypal" | "bank_transfer" | "cod" | "wallet";
  /** Last 4 digits (for card payments) */
  readonly last4?: string;
  /** Card brand (e.g., "visa", "mastercard") */
  readonly brand?: string;
  /** Expiry month (1-12) */
  readonly expiryMonth?: number;
  /** Expiry year (4-digit) */
  readonly expiryYear?: number;
  /** PayPal email or wallet identifier */
  readonly accountEmail?: string;
  /** Transaction ID from payment processor */
  readonly transactionId?: string;
}

/**
 * Represents a single item in an order (snapshot at purchase time)
 * @example
 * {
 *   id: "oi_123",
 *   productId: "prod_456",
 *   variantId: "var_789",
 *   name: "Premium Running Shoes",
 *   slug: "premium-running-shoes",
 *   sku: "SHOE-RED-42",
 *   image: { url: "...", alt: "..." },
 *   price: 89.99,
 *   compareAtPrice: 99.99,
 *   quantity: 2,
 *   total: 179.98,
 *   variantName: "Red - Size 42"
 * }
 */
export interface OrderItem {
  /** Unique order item identifier */
  readonly id: string;
  /** Product ID at time of purchase */
  readonly productId: string;
  /** Variant ID (if applicable) */
  readonly variantId?: string;
  /** Product name at time of purchase */
  readonly name: string;
  /** Product slug for linking */
  readonly slug: string;
  /** SKU at time of purchase */
  readonly sku: string;
  /** Product image at time of purchase */
  readonly image?: ProductImage;
  /** Price paid per unit */
  readonly price: number;
  /** Original price before discount */
  readonly compareAtPrice?: number;
  /** Quantity purchased */
  readonly quantity: number;
  /** Total for this line (price × quantity) */
  readonly total: number;
  /** Human-readable variant description */
  readonly variantName?: string;
  /** Whether item can be returned */
  readonly isReturnable?: boolean;
  /** Return status if applicable */
  readonly returnStatus?: "not_returned" | "return_requested" | "returned" | "refunded";
}

/**
 * Address type for shipping and billing
 * @example
 * {
 *   id: "addr_123",
 *   userId: "user_456",
 *   type: "shipping",
 *   label: "Home",
 *   name: "John Doe",
 *   firstName: "John",
 *   lastName: "Doe",
 *   company: "ACME Inc",
 *   street: "123 Main Street",
 *   street2: "Apt 4B",
 *   city: "New York",
 *   state: "NY",
 *   zip: "10001",
 *   country: "US",
 *   phone: "+1-555-123-4567",
 *   isDefault: true
 * }
 */
export interface Address {
  /** Unique address identifier */
  readonly id: string;
  /** User this address belongs to */
  readonly userId?: string;
  /** Type of address */
  readonly type: "shipping" | "billing" | "both";
  /** User-defined label (e.g., "Home", "Office") */
  readonly label?: string;
  /** Full name for delivery */
  readonly name?: string;
  /** First name */
  readonly firstName: string;
  /** Last name */
  readonly lastName: string;
  /** Company name (optional) */
  readonly company?: string;
  /** Street address line 1 */
  readonly street: string;
  /** Street address line 2 (apartment, suite, etc.) */
  readonly street2?: string;
  /** City name */
  readonly city: string;
  /** State or province */
  readonly state: string;
  /** ZIP or postal code */
  readonly zip: string;
  /** Country code (ISO 3166-1 alpha-2) */
  readonly country: string;
  /** Contact phone number */
  readonly phone?: string;
  /** Whether this is the default address */
  readonly isDefault: boolean;
  /** Delivery instructions */
  readonly instructions?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

/**
 * Order totals breakdown
 */
export interface OrderTotals {
  /** Sum of all items before discounts */
  readonly subtotal: number;
  /** Discount amount applied */
  readonly discount: number;
  /** Shipping cost */
  readonly shipping: number;
  /** Tax amount */
  readonly tax: number;
  /** Final total amount */
  readonly total: number;
  /** Currency code */
  readonly currency: string;
}

/**
 * Represents a customer order
 * @example
 * {
 *   id: "ord_123",
 *   userId: "user_456",
 *   orderNumber: "ORD-2024-001",
 *   items: [...],
 *   status: "processing",
 *   paymentStatus: "completed",
 *   shippingAddress: {...},
 *   billingAddress: {...},
 *   payment: {...},
 *   totals: {...},
 *   notes: "Please gift wrap",
 *   trackingNumber: "TRACK123456",
 *   createdAt: "2024-01-20T10:00:00Z",
 *   updatedAt: "2024-01-20T10:05:00Z"
 * }
 */
export interface Order {
  /** Unique order identifier */
  readonly id: string;
  /** User who placed the order */
  readonly userId: string;
  /** Human-readable order number */
  readonly orderNumber: string;
  /** Items in the order */
  readonly items: OrderItem[];
  /** Current order status */
  readonly status: OrderStatus;
  /** Payment status */
  readonly paymentStatus: PaymentStatus;
  /** Shipping address */
  readonly shippingAddress: Address;
  /** Billing address */
  readonly billingAddress: Address;
  /** Payment method details */
  readonly payment: PaymentMethod;
  /** Order totals breakdown */
  readonly totals: OrderTotals;
  /** Customer notes */
  readonly notes?: string;
  /** Internal staff notes */
  readonly internalNotes?: string;
  /** Shipping carrier name */
  readonly carrier?: string;
  /** Tracking number for shipment */
  readonly trackingNumber?: string;
  /** Estimated delivery date */
  readonly estimatedDelivery?: string;
  /** Actual delivery date */
  readonly deliveredAt?: string;
  /** Invoice URL or ID */
  readonly invoiceUrl?: string;
  /** Currency code */
  readonly currency: string;
  /** IP address of order placement */
  readonly ipAddress?: string;
  /** User agent string */
  readonly userAgent?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// =============================================================================
// USER TYPES
// =============================================================================

/**
 * User role union type
 */
export type UserRole = "customer" | "admin" | "moderator";

/**
 * Represents a user in the system
 * @example
 * {
 *   id: "user_123",
 *   email: "john@example.com",
 *   firstName: "John",
 *   lastName: "Doe",
 *   phone: "+1-555-123-4567",
 *   avatar: "https://cdn.example.com/avatars/john.jpg",
 *   role: "customer",
 *   emailVerified: true,
 *   createdAt: "2024-01-01T00:00:00Z"
 * }
 */
export interface User {
  /** Unique user identifier */
  readonly id: string;
  /** User's email address (unique) */
  readonly email: string;
  /** User's first name */
  readonly firstName: string;
  /** User's last name */
  readonly lastName: string;
  /** User's full name (computed) */
  readonly fullName?: string;
  /** Phone number */
  readonly phone?: string;
  /** Avatar image URL */
  readonly avatar?: string;
  /** User role for permissions */
  readonly role: UserRole;
  /** Whether email has been verified */
  readonly emailVerified?: boolean;
  /** Whether account is active */
  readonly isActive?: boolean;
  /** Marketing preferences */
  readonly preferences?: {
    readonly newsletter?: boolean;
    readonly promotions?: boolean;
    readonly smsNotifications?: boolean;
  };
  readonly createdAt: string;
  readonly updatedAt?: string;
  /** Last login timestamp */
  readonly lastLoginAt?: string;
}

/**
 * Extended user profile with addresses
 */
export interface UserProfile extends User {
  /** User's saved addresses */
  readonly addresses: Address[];
  /** Default shipping address */
  readonly defaultShippingAddress?: Address;
  /** Default billing address */
  readonly defaultBillingAddress?: Address;
  /** Order history summary */
  readonly orderSummary?: {
    readonly totalOrders: number;
    readonly totalSpent: number;
  };
}

// =============================================================================
// AUTH TYPES
// =============================================================================

/**
 * Authentication state for auth context/store
 */
export interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;
  /** JWT or session token */
  token: string | null;
  /** Whether user is authenticated */
  readonly isAuthenticated: boolean;
  /** Whether auth check is in progress */
  readonly isLoading: boolean;
  /** Error message from last auth operation */
  readonly error: string | null;
  /** Whether auth has been initialized */
  readonly isInitialized: boolean;
}

/**
 * Login credentials
 * @example
 * { email: "user@example.com", password: "********", rememberMe: true }
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Whether to persist session */
  rememberMe?: boolean;
}

/**
 * Registration data
 * @example
 * {
 *   email: "user@example.com",
 *   password: "********",
 *   firstName: "John",
 *   lastName: "Doe",
 *   phone: "+1-555-123-4567"
 * }
 */
export interface RegisterData {
  /** Email address (will be used as username) */
  email: string;
  /** Password (min 8 chars, must meet strength requirements) */
  password: string;
  /** Confirm password (must match password) */
  confirmPassword?: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Phone number (optional) */
  phone?: string;
  /** Accept terms and conditions */
  acceptTerms?: boolean;
  /** Subscribe to newsletter */
  newsletter?: boolean;
}

/**
 * Response from authentication endpoints
 */
export interface AuthResponse {
  /** Authenticated user data */
  user: User;
  /** Access token */
  token: string;
  /** Refresh token (for long-lived sessions) */
  refreshToken?: string;
  /** Token expiration timestamp */
  expiresAt: string;
  /** Token expiration in seconds */
  expiresIn?: number;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// =============================================================================
// REVIEW TYPES
// =============================================================================

/**
 * Represents a product review
 * @example
 * {
 *   id: "rev_123",
 *   productId: "prod_456",
 *   userId: "user_789",
 *   user: { ...User },
 *   rating: 5,
 *   title: "Amazing shoes!",
 *   content: "These are the most comfortable running shoes...",
 *   isVerifiedPurchase: true,
 *   helpful: 12,
 *   images: [...],
 *   createdAt: "2024-01-15T10:00:00Z"
 * }
 */
export interface Review {
  /** Unique review identifier */
  readonly id: string;
  /** Product being reviewed */
  readonly productId: string;
  /** User who wrote the review */
  readonly userId: string;
  /** User details (populated) */
  readonly user: Pick<User, "id" | "firstName" | "lastName" | "avatar">;
  /** Rating (1-5 stars) */
  readonly rating: number;
  /** Review title/summary */
  readonly title: string;
  /** Full review content */
  readonly content: string;
  /** Whether reviewer purchased the product */
  readonly isVerifiedPurchase: boolean;
  /** Number of users who found this helpful */
  readonly helpful: number;
  /** Whether current user marked as helpful */
  readonly isHelpful?: boolean;
  /** Review images */
  readonly images?: ProductImage[];
  /** Merchant response to review */
  readonly response?: {
    readonly content: string;
    readonly respondedAt: string;
    readonly respondedBy: string;
  };
  /** Whether review is approved and visible */
  readonly isApproved?: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

/**
 * Input data for creating a review
 */
export interface ReviewInput {
  /** Product being reviewed */
  productId: string;
  /** Rating (1-5) */
  rating: number;
  /** Review title */
  title: string;
  /** Review content */
  content: string;
  /** Review images */
  images?: string[];
  /** Order ID to verify purchase */
  orderId?: string;
}

/**
 * Review summary for product cards
 */
export interface ReviewSummary {
  readonly average: number;
  readonly count: number;
  readonly distribution: {
    readonly 5: number;
    readonly 4: number;
    readonly 3: number;
    readonly 2: number;
    readonly 1: number;
  };
}

// =============================================================================
// API TYPES
// =============================================================================

/**
 * Standard API error structure
 * @example
 * { code: "VALIDATION_ERROR", message: "Invalid input", field: "email" }
 */
export interface ApiError {
  /** Error code for programmatic handling */
  readonly code: string;
  /** Human-readable error message */
  readonly message: string;
  /** Field name for validation errors */
  readonly field?: string;
  /** Additional error details */
  readonly details?: Record<string, unknown>;
}

/**
 * Standard API response wrapper
 * @example
 * {
 *   success: true,
 *   data: { ... },
 *   message: "Operation successful",
 *   errors: []
 * }
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  readonly success: boolean;
  /** Response data (present if success is true) */
  readonly data: T;
  /** Success or error message */
  readonly message?: string;
  /** Error details (present if success is false) */
  readonly errors?: ApiError[];
  /** HTTP status code */
  readonly statusCode?: number;
  /** Request timestamp */
  readonly timestamp?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page number (1-based) */
  readonly page: number;
  /** Items per page */
  readonly limit: number;
  /** Total number of items */
  readonly total: number;
  /** Total number of pages */
  readonly totalPages: number;
  /** Whether there is a next page */
  readonly hasNextPage: boolean;
  /** Whether there is a previous page */
  readonly hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 * @example
 * {
 *   data: [...],
 *   pagination: { page: 1, limit: 20, total: 150, totalPages: 8, hasNextPage: true, hasPrevPage: false }
 * }
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  readonly data: T[];
  /** Pagination metadata */
  readonly pagination: PaginationMeta;
}

/**
 * Pagination parameters for requests
 * @example
 * { page: 1, limit: 20, sort: "createdAt", order: "desc" }
 */
export interface PaginationParams {
  /** Page number (1-based, default: 1) */
  page?: number;
  /** Items per page (default: 20, max: 100) */
  limit?: number;
  /** Field to sort by */
  sort?: string;
  /** Sort direction */
  order?: "asc" | "desc";
}

/**
 * Query parameters for list endpoints
 */
export interface ListQueryParams extends PaginationParams {
  /** Search query string */
  search?: string;
  /** Filter by fields */
  filter?: Record<string, string | string[]>;
  /** Include related data */
  include?: string[];
}

// =============================================================================
// FILTER/SORT TYPES
// =============================================================================

/**
 * Sort options for product listings
 */
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating"
  | "newest"
  | "bestselling"
  | "reviews";

/**
 * Price range filter
 */
export interface PriceRange {
  /** Minimum price */
  readonly min?: number;
  /** Maximum price */
  readonly max?: number;
}

/**
 * Product filters for catalog browsing
 * @example
 * {
 *   category: "cat_shoes",
 *   categories: ["cat_shoes", "cat_accessories"],
 *   priceRange: { min: 50, max: 200 },
 *   rating: 4,
 *   inStock: true,
 *   sortBy: "price-asc",
 *   brands: ["Nike", "Adidas"],
 *   attributes: { color: ["red", "blue"] }
 * }
 */
export interface ProductFilters {
  /** Single category ID */
  category?: string;
  /** Multiple category IDs */
  categories?: string[];
  /** Price range filter */
  priceRange?: PriceRange;
  /** Minimum rating filter */
  rating?: number;
  /** Only show in-stock items */
  inStock?: boolean;
  /** Sort order */
  sortBy?: SortOption;
  /** Search query */
  search?: string;
  /** Filter by brands */
  brands?: string[];
  /** Dynamic attribute filters (color, size, etc.) */
  attributes?: Record<string, string[]>;
  /** Tag filters */
  tags?: string[];
  /** Only show featured products */
  featured?: boolean;
  /** Only show sale items */
  onSale?: boolean;
}

/**
 * Filter parameters compatible with query strings
 * All values are strings for URL serialization
 */
export interface FilterParams {
  /** Category slug or ID */
  category?: string;
  /** Min price as string */
  minPrice?: string;
  /** Max price as string */
  maxPrice?: string;
  /** Min rating as string */
  minRating?: string;
  /** In stock flag */
  inStock?: string;
  /** Sort option */
  sort?: string;
  /** Page number */
  page?: string;
  /** Items per page */
  limit?: string;
  /** Search query */
  q?: string;
  /** Brand filter */
  brand?: string | string[];
  /** Color filter */
  color?: string | string[];
  /** Size filter */
  size?: string | string[];
  /** Tag filter */
  tag?: string | string[];
}

/**
 * Active filter state (for UI)
 */
export interface ActiveFilter {
  /** Filter type/key */
  readonly key: string;
  /** Display label */
  readonly label: string;
  /** Filter value */
  readonly value: string | number | boolean;
  /** Human-readable value display */
  readonly displayValue: string;
}

// =============================================================================
// UI/UTILITY TYPES
// =============================================================================

/**
 * Loading state union type
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Async operation state
 */
export interface AsyncState<T> {
  /** Current data */
  data: T | null;
  /** Loading state */
  readonly state: LoadingState;
  /** Error if state is 'error' */
  readonly error: ApiError | null;
}

/**
 * Navigation menu item
 */
export interface NavItem {
  /** Display label */
  readonly label: string;
  /** URL href */
  readonly href: string;
  /** Icon component name or identifier */
  readonly icon?: string;
  /** Child items for dropdown menus */
  readonly children?: NavItem[];
  /** Whether item is disabled */
  readonly disabled?: boolean;
  /** External link flag */
  readonly external?: boolean;
}

/**
 * Select/option type
 */
export interface SelectOption<T = string> {
  /** Option value */
  readonly value: T;
  /** Display label */
  readonly label: string;
  /** Whether option is disabled */
  readonly disabled?: boolean;
  /** Group/category name */
  readonly group?: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Display label */
  readonly label: string;
  /** URL (undefined for current page) */
  readonly href?: string;
  /** Icon identifier */
  readonly icon?: string;
}

/**
 * Meta data for SEO
 */
export interface SeoMeta {
  /** Page title */
  readonly title: string;
  /** Meta description */
  readonly description?: string;
  /** Canonical URL */
  readonly canonical?: string;
  /** Open Graph image URL */
  readonly ogImage?: string;
  /** Robots directive */
  readonly robots?: string;
  /** Keywords */
  readonly keywords?: string[];
  /** JSON-LD structured data */
  readonly jsonLd?: Record<string, unknown>;
}

// =============================================================================
// FEATURE FLAGS & CONFIG TYPES
// =============================================================================

/**
 * Application configuration
 */
export interface AppConfig {
  /** Site name */
  readonly siteName: string;
  /** Site URL */
  readonly siteUrl: string;
  /** Default currency */
  readonly defaultCurrency: string;
  /** Available currencies */
  readonly currencies: string[];
  /** Default language */
  readonly defaultLanguage: string;
  /** Available languages */
  readonly languages: string[];
  /** Feature flags */
  readonly features: {
    readonly reviews: boolean;
    readonly wishlist: boolean;
    readonly compare: boolean;
    readonly guestCheckout: boolean;
    readonly multipleAddresses: boolean;
  };
  /** Shipping configuration */
  readonly shipping: {
    readonly freeShippingThreshold?: number;
    readonly defaultRate: number;
    readonly rates: ShippingRate[];
  };
}

/**
 * Shipping rate
 */
export interface ShippingRate {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly rate: number;
  readonly minWeight?: number;
  readonly maxWeight?: number;
  readonly estimatedDays: string;
}

// =============================================================================
// RE-EXPORTS (barrel pattern)
// =============================================================================

// All types are exported above using 'export interface/type'
// This file serves as the central types barrel
