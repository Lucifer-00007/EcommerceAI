/**
 * Application Constants
 * 
 * Centralized location for all app-wide constants.
 * This ensures consistency and makes updates easier.
 */

/**
 * App Configuration
 */
export const APP_CONFIG = {
  name: "ShopNext",
  tagline: "Discover Amazing Products",
  description:
    "Your one-stop destination for quality products at unbeatable prices.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: "1.0.0",
} as const;

/**
 * Navigation Links
 * Used in Header, Footer, and Mobile Navigation
 */
export const NAV_LINKS = {
  main: [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/deals", label: "Deals" },
  ],
  shop: [
    { href: "/cart", label: "Cart" },
    { href: "/account", label: "Account" },
  ],
  auth: [
    { href: "/login", label: "Sign In" },
    { href: "/register", label: "Create Account" },
  ],
  footer: [
    {
      title: "Shop",
      links: [
        { href: "/products", label: "All Products" },
        { href: "/categories", label: "Categories" },
        { href: "/deals", label: "Deals" },
        { href: "/new-arrivals", label: "New Arrivals" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/faq", label: "FAQ" },
        { href: "/shipping", label: "Shipping Info" },
        { href: "/returns", label: "Returns" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/blog", label: "Blog" },
        { href: "/press", label: "Press" },
      ],
    },
  ],
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  maxLimit: 100,
  options: [12, 24, 48, 96],
} as const;

/**
 * Cart Configuration
 */
export const CART_CONFIG = {
  maxQuantity: 99,
  minQuantity: 1,
  localStorageKey: "shopnext-cart",
} as const;

/**
 * Image Configuration
 */
export const IMAGES = {
  productPlaceholder: "/placeholder-product.svg",
  avatarPlaceholder: "/placeholder-avatar.svg",
  categories: {
    basePath: "/images/categories",
    sizes: [400, 800, 1200] as const,
  },
  products: {
    basePath: "/images/products",
    sizes: [400, 800, 1200] as const,
  },
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000, // 10 seconds
  retries: 2,
} as const;

/**
 * Cache Configuration (for TanStack Query)
 */
export const CACHE_CONFIG = {
  products: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  categories: {
    staleTime: 60 * 60 * 1000, // 1 hour (categories rarely change)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  user: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  cart: {
    staleTime: 0, // Always fresh
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
} as const;

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  pageTransition: 400,
} as const;

/**
 * Breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Product Configuration
 */
export const PRODUCT_CONFIG = {
  maxRating: 5,
  minRating: 1,
  priceRange: {
    min: 0,
    max: 10000,
  },
  sortOptions: [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ],
} as const;

/**
 * Checkout Configuration
 */
export const CHECKOUT_CONFIG = {
  steps: [
    { id: "shipping", label: "Shipping", path: "/checkout/shipping" },
    { id: "payment", label: "Payment", path: "/checkout/payment" },
    { id: "review", label: "Review", path: "/checkout/review" },
  ],
  maxAddressLength: 200,
  maxPhoneLength: 20,
} as const;

/**
 * Social Links
 */
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/shopnext",
  twitter: "https://twitter.com/shopnext",
  instagram: "https://instagram.com/shopnext",
  youtube: "https://youtube.com/shopnext",
} as const;

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  short: new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  long: new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  time: new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }),
} as const;

/**
 * Currency Format
 */
export const CURRENCY = {
  code: "USD",
  symbol: "$",
  format: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
} as const;

// =============================================================================
// STORAGE KEYS
// =============================================================================

/**
 * localStorage keys for persistence
 */
export const CART_STORAGE_KEY = "ecommerce-cart";
export const AUTH_STORAGE_KEY = "ecommerce-auth";

// =============================================================================
// CART CONSTANTS
// =============================================================================

/**
 * Maximum quantity per item in cart
 */
export const MAX_CART_QUANTITY = 10;

/**
 * Minimum quantity per item in cart
 */
export const MIN_CART_QUANTITY = 1;

/**
 * Free shipping threshold in USD
 */
export const FREE_SHIPPING_THRESHOLD = 50;

/**
 * Standard shipping cost when under free shipping threshold
 */
export const SHIPPING_COST = 5.99;

/**
 * Tax rate (8%)
 */
export const TAX_RATE = 0.08;
