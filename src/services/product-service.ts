import { Product, PaginatedResponse, ProductFilters, Category } from '@/types'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const productService = {
  async getProducts(
    filters?: ProductFilters,
    page = 1,
    pageSize = 12
  ): Promise<PaginatedResponse<Product>> {
    await delay(500)
    
    let filtered = [...MOCK_PRODUCTS]
    
    // Apply filters
    if (filters?.category) {
      filtered = filtered.filter((p) => p.category === filters.category)
    }
    
    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!)
    }
    
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
    }
    
    if (filters?.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating!)
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      )
    }
    
    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          // In real app, would sort by createdAt
          break
      }
    }
    
    // Pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filtered.slice(start, end)
    
    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize,
    }
  },
  
  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(300)
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null
  },
  
  async getFeaturedProducts(): Promise<Product[]> {
    await delay(300)
    return MOCK_PRODUCTS.filter((p) => p.featured)
  },
  
  async getCategories(): Promise<Category[]> {
    await delay(200)
    return MOCK_CATEGORIES
  },
}
