import { 
  Product, 
  Category, 
  SearchParams, 
  PaginatedResponse, 
  ApiResponse,
  User,
  LoginForm,
  RegisterForm
} from '@/types'
import { mockProducts, mockCategories, mockUser } from '@/lib/mock-data'

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Generic API wrapper
class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  // Product API methods
  async getProducts(params?: SearchParams): Promise<PaginatedResponse<Product>> {
    await delay(300) // Simulate network delay
    
    let filteredProducts = [...mockProducts]
    
    // Apply search filter
    if (params?.query) {
      const query = params.query.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    if (params?.filters?.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === params.filters?.category
      )
    }
    
    // Apply price range filter
    if (params?.filters?.priceRange) {
      const [min, max] = params.filters.priceRange
      filteredProducts = filteredProducts.filter(product =>
        product.price >= min && product.price <= max
      )
    }
    
    // Apply rating filter
    if (params?.filters?.rating) {
      filteredProducts = filteredProducts.filter(product =>
        product.rating >= (params.filters?.rating || 0)
      )
    }
    
    // Apply stock filter
    if (params?.filters?.inStock) {
      filteredProducts = filteredProducts.filter(product => product.stock > 0)
    }
    
    // Apply featured filter
    if (params?.filters?.featured) {
      filteredProducts = filteredProducts.filter(product => product.featured)
    }
    
    // Apply sorting
    if (params?.sort) {
      filteredProducts.sort((a, b) => {
        const { field, direction } = params.sort!
        let aValue: any = a[field]
        let bValue: any = b[field]
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        
        if (direction === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
    
    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 12
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return {
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1
      }
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay(200)
    const product = mockProducts.find(p => p.id === id)
    return product || null
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(200)
    return mockProducts.filter(product => product.featured)
  }

  async getCategories(): Promise<Category[]> {
    await delay(200)
    return mockCategories
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(200)
    const category = mockCategories.find(c => c.slug === slug)
    return category || null
  }

  // Authentication methods (mock implementation)
  async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    await delay(500)
    
    // Mock authentication - in real app, this would call an API
    if (credentials.email === 'john.doe@example.com' && credentials.password === 'password') {
      return {
        data: mockUser,
        message: 'Login successful',
        success: true
      }
    }
    
    return {
      data: null as any,
      message: 'Invalid credentials',
      success: false
    }
  }

  async register(userData: RegisterForm): Promise<ApiResponse<User>> {
    await delay(500)
    
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: `u${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return {
      data: newUser,
      message: 'Registration successful',
      success: true
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    await delay(200)
    return {
      data: null,
      message: 'Logout successful',
      success: true
    }
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(200)
    // In real app, this would check session/token
    // For mock, we'll return null (not logged in)
    return null
  }
}

export const apiService = new ApiService()
