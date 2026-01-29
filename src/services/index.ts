/**
 * Services
 *
 * API services and external integrations.
 */

// API client and utilities
export {
  apiRequest,
  apiClient,
  api,
  ApiErrorClass,
  type RequestOptions,
  type ApiClientConfig,
} from "./api";

// Mock data (for development)
export {
  // Data
  mockProducts,
  mockCategories,
  categoriesWithHierarchy,
  mockReviews,
  mockUsers,
  mockAddresses,
  mockOrders,
  // Utilities
  delay,
  simulateError,
  generateId,
  getUserProfile,
  getProductReviews,
  getProductBySlug,
  getCategoryBySlug,
  getProductsByCategory,
} from "./mock-data";

// Product API functions (async versions preferred)
export {
  getProducts,
  getProductById,
  getProductBySlugAsync,
  getCategories,
  getCategoryBySlugAsync,
  getRelatedProductsAsync,
  searchProductsAsync,
  getFeaturedProducts,
  getSaleProducts,
  getNewArrivals,
  getProductRecommendations,
  type GetProductsParams,
  type SearchResult,
} from "./products";
