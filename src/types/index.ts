// Product related types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  brand: string
  sku: string
  stock: number
  rating: number
  reviews: Review[]
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  createdAt: string
}

// Category related types
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId?: string
  children?: Category[]
  productCount: number
}

// Cart related types
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selected: boolean
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  discount: number
}

// User related types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  addresses: Address[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  type: 'shipping' | 'billing'
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

// Order related types
export interface Order {
  id: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

// API response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter and search types
export interface ProductFilters {
  category?: string
  subcategory?: string
  brand?: string
  priceRange?: [number, number]
  rating?: number
  inStock?: boolean
  featured?: boolean
  tags?: string[]
}

export interface SortOption {
  field: 'name' | 'price' | 'rating' | 'createdAt'
  direction: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  filters?: ProductFilters
  sort?: SortOption
  page?: number
  limit?: number
}

// Form types
export interface LoginForm {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface CheckoutForm {
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  notes?: string
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface CartState {
  cart: Cart | null
  isLoading: boolean
  error?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error?: string
  isAuthenticated: boolean
}
