/**
 * API Service Layer
 * 
 * This file provides a clean abstraction for all API calls in the application.
 * In a real application, these would make actual HTTP requests to a backend server.
 * For this demo, we simulate API calls with mock data and artificial delays.
 * 
 * The pattern used here:
 * 1. Define clear interfaces for all API operations
 * 2. Implement mock versions that simulate network behavior
 * 3. Return consistent response structures
 * 4. Add artificial delays to simulate real network latency
 */

import { 
  Product, 
  Category, 
  Order, 
  User, 
  Address,
  Review,
  LoginCredentials,
  RegisterData,
  ProductFilters,
  ProductSortOption,
  PaginatedResponse,
  ApiResponse 
} from '@/types'
import { 
  mockProducts, 
  mockCategories, 
  mockOrders, 
  mockUser,
  mockAddresses,
  mockReviews,
  mockShippingMethods
} from '@/mock/data'

// ============================================================================
// CONFIGURATION
// ============================================================================

/** Simulated network delay in milliseconds */
const API_DELAY = 500

/** Default pagination limit */
const DEFAULT_PAGE_SIZE = 12

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulates network delay for mock API calls
 * This makes the demo feel more realistic
 */
function simulateDelay(ms: number = API_DELAY): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Creates a standardized API response
 */
function createResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

/**
 * Creates a standardized error response
 */
function createError(message: string, errors?: Record<string, string[]>): ApiResponse<never> {
  return {
    success: false,
    error: message,
    errors,
  }
}

// ============================================================================
// PRODUCT API
// ============================================================================

export const productApi = {
  /**
   * Fetches a paginated list of products with optional filtering and sorting
   * 
   * @param filters - Product filter criteria
   * @param sort - Sort option
   * @param page - Page number (1-based)
   * @param limit - Items per page
   * @returns Paginated product list
   */
  async getProducts(
    filters?: ProductFilters,
    sort: ProductSortOption = 'featured',
    page: number = 1,
    limit: number = DEFAULT_PAGE_SIZE
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await simulateDelay()

    let filteredProducts = [...mockProducts]

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === filters.category)
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!)
      }

      if (filters.minRating !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.rating >= filters.minRating!)
      }

      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(p => p.inStock)
      }

      if (filters.onSale) {
        filteredProducts = filteredProducts.filter(p => p.isOnSale)
      }

      if (filters.featured) {
        filteredProducts = filteredProducts.filter(p => p.isFeatured)
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          filters.tags!.some(tag => p.tags.includes(tag))
        )
      }
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      default: // 'featured' - no specific sort, use default order
        break
    }

    // Apply pagination
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return createResponse({
      data: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    })
  },

  /**
   * Fetches a single product by its slug
   * 
   * @param slug - Product slug
   * @returns Product details or null if not found
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<Product | null>> {
    await simulateDelay()

    const product = mockProducts.find(p => p.slug === slug)
    
    if (!product) {
      return createError('Product not found')
    }

    return createResponse(product)
  },

  /**
   * Fetches a single product by its ID
   * 
   * @param id - Product ID
   * @returns Product details or null if not found
   */
  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    await simulateDelay()

    const product = mockProducts.find(p => p.id === id)
    
    if (!product) {
      return createError('Product not found')
    }

    return createResponse(product)
  },

  /**
   * Fetches featured products for homepage
   * 
   * @param limit - Number of products to return
   * @returns Featured products
   */
  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    await simulateDelay()

    const featured = mockProducts
      .filter(p => p.isFeatured)
      .slice(0, limit)

    return createResponse(featured)
  },

  /**
   * Fetches products on sale
   * 
   * @param limit - Number of products to return
   * @returns Products on sale
   */
  async getSaleProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    await simulateDelay()

    const onSale = mockProducts
      .filter(p => p.isOnSale)
      .slice(0, limit)

    return createResponse(onSale)
  },

  /**
   * Fetches related products for a given product
   * 
   * @param productId - Product ID to find related items for
   * @param limit - Number of products to return
   * @returns Related products
   */
  async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    await simulateDelay()

    const product = mockProducts.find(p => p.id === productId)
    
    if (!product) {
      return createError('Product not found')
    }

    // Find products in the same category, excluding the current product
    const related = mockProducts
      .filter(p => p.categoryId === product.categoryId && p.id !== productId)
      .slice(0, limit)

    return createResponse(related)
  },

  /**
   * Searches products by query string
   * 
   * @param query - Search query
   * @param limit - Maximum results
   * @returns Matching products
   */
  async searchProducts(query: string, limit: number = 10): Promise<ApiResponse<Product[]>> {
    await simulateDelay(300) // Faster for search-as-you-type

    if (!query.trim()) {
      return createResponse([])
    }

    const searchLower = query.toLowerCase()
    const results = mockProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      p.category.name.toLowerCase().includes(searchLower)
    ).slice(0, limit)

    return createResponse(results)
  },
}

// ============================================================================
// CATEGORY API
// ============================================================================

export const categoryApi = {
  /**
   * Fetches all categories
   * 
   * @returns All categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    await simulateDelay()

    return createResponse(mockCategories)
  },

  /**
   * Fetches a single category by its slug
   * 
   * @param slug - Category slug
   * @returns Category details or null if not found
   */
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
    await simulateDelay()

    const category = mockCategories.find(c => c.slug === slug)
    
    if (!category) {
      return createError('Category not found')
    }

    return createResponse(category)
  },

  /**
   * Fetches a single category by its ID
   * 
   * @param id - Category ID
   * @returns Category details or null if not found
   */
  async getCategoryById(id: string): Promise<ApiResponse<Category | null>> {
    await simulateDelay()

    const category = mockCategories.find(c => c.id === id)
    
    if (!category) {
      return createError('Category not found')
    }

    return createResponse(category)
  },
}

// ============================================================================
// REVIEW API
// ============================================================================

export const reviewApi = {
  /**
   * Fetches reviews for a product
   * 
   * @param productId - Product ID
   * @returns Product reviews
   */
  async getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
    await simulateDelay()

    const reviews = mockReviews.filter(r => r.productId === productId)
    
    return createResponse(reviews)
  },

  /**
   * Submits a new review
   * 
   * @param review - Review data
   * @returns Created review
   */
  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<ApiResponse<Review>> {
    await simulateDelay(800) // Slightly longer for write operations

    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    return createResponse(newReview, 'Review submitted successfully')
  },
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  /**
   * Authenticates a user with email and password
   * 
   * @param credentials - Login credentials
   * @returns User data and tokens
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await simulateDelay(800)

    // Simulate authentication - in real app, validate against database
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      return createResponse({
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
      })
    }

    // For demo purposes, accept any email with password "password"
    if (credentials.password === 'password') {
      return createResponse({
        user: { ...mockUser, email: credentials.email },
        token: 'mock-jwt-token-' + Date.now(),
      })
    }

    return createError('Invalid email or password')
  },

  /**
   * Registers a new user
   * 
   * @param data - Registration data
   * @returns Created user data
   */
  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    await simulateDelay(1000)

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      return createError('Passwords do not match', {
        confirmPassword: ['Passwords do not match'],
      })
    }

    // Simulate creating a new user
    const newUser: User = {
      ...mockUser,
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString(),
    }

    return createResponse({
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
    }, 'Account created successfully')
  },

  /**
   * Logs out the current user
   */
  async logout(): Promise<ApiResponse<void>> {
    await simulateDelay(300)

    return createResponse(undefined, 'Logged out successfully')
  },

  /**
   * Fetches the current user's profile
   * 
   * @returns Current user data
   */
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await simulateDelay()

    // In a real app, this would validate the session/token
    // For demo, we'll return the mock user
    return createResponse(mockUser)
  },

  /**
   * Updates the user's profile
   * 
   * @param data - Profile update data
   * @returns Updated user
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    await simulateDelay(800)

    const updatedUser = { ...mockUser, ...data, updatedAt: new Date().toISOString() }
    
    return createResponse(updatedUser, 'Profile updated successfully')
  },
}

// ============================================================================
// ORDER API
// ============================================================================

export const orderApi = {
  /**
   * Fetches all orders for the current user
   * 
   * @returns User's orders
   */
  async getOrders(): Promise<ApiResponse<Order[]>> {
    await simulateDelay()

    return createResponse(mockOrders)
  },

  /**
   * Fetches a single order by ID
   * 
   * @param orderId - Order ID
   * @returns Order details
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order | null>> {
    await simulateDelay()

    const order = mockOrders.find(o => o.id === orderId)
    
    if (!order) {
      return createError('Order not found')
    }

    return createResponse(order)
  },

  /**
   * Creates a new order
   * 
   * @param orderData - Order creation data
   * @returns Created order
   */
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): 
    Promise<ApiResponse<Order>> {
    await simulateDelay(1000)

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return createResponse(newOrder, 'Order placed successfully')
  },

  /**
   * Cancels an order
   * 
   * @param orderId - Order ID to cancel
   * @returns Updated order
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    await simulateDelay(800)

    const order = mockOrders.find(o => o.id === orderId)
    
    if (!order) {
      return createError('Order not found')
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return createError('Order cannot be cancelled')
    }

    const updatedOrder = {
      ...order,
      status: 'cancelled' as const,
      updatedAt: new Date().toISOString(),
    }

    return createResponse(updatedOrder, 'Order cancelled successfully')
  },
}

// ============================================================================
// ADDRESS API
// ============================================================================

export const addressApi = {
  /**
   * Fetches all addresses for the current user
   * 
   * @returns User's addresses
   */
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    await simulateDelay()

    return createResponse(mockAddresses)
  },

  /**
   * Creates a new address
   * 
   * @param address - Address data
   * @returns Created address
   */
  async createAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    await simulateDelay(600)

    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    }

    return createResponse(newAddress, 'Address added successfully')
  },

  /**
   * Updates an existing address
   * 
   * @param id - Address ID
   * @param address - Updated address data
   * @returns Updated address
   */
  async updateAddress(id: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    await simulateDelay(600)

    const existingAddress = mockAddresses.find(a => a.id === id)
    
    if (!existingAddress) {
      return createError('Address not found')
    }

    const updatedAddress = { ...existingAddress, ...address }

    return createResponse(updatedAddress, 'Address updated successfully')
  },

  /**
   * Deletes an address
   * 
   * @param id - Address ID to delete
   */
  async deleteAddress(id: string): Promise<ApiResponse<void>> {
    await simulateDelay(400)

    const address = mockAddresses.find(a => a.id === id)
    
    if (!address) {
      return createError('Address not found')
    }

    return createResponse(undefined, 'Address deleted successfully')
  },
}

// ============================================================================
// SHIPPING API
// ============================================================================

export const shippingApi = {
  /**
   * Fetches available shipping methods
   * 
   * @returns Shipping methods
   */
  async getShippingMethods(): Promise<ApiResponse<typeof mockShippingMethods>> {
    await simulateDelay()

    return createResponse(mockShippingMethods)
  },
}

// ============================================================================
// EXPORT ALL APIS
// ============================================================================

export const api = {
  products: productApi,
  categories: categoryApi,
  reviews: reviewApi,
  auth: authApi,
  orders: orderApi,
  addresses: addressApi,
  shipping: shippingApi,
}

export default api
