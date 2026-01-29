// Products service
// Handles product-related API calls

import type {
  Product,
  ProductCategory,
  ProductFilter,
  ProductListResponse,
  ProductReview,
} from '@/types/product.types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, PAGINATION, MOCK_API_DELAY } from '@/lib/constants';
import {
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  mockDelay,
  getProductById as getMockProductById,
  getProductsByCategory as getMockProductsByCategory,
  getReviewsByProductId,
} from '@/lib/mock-data';

/**
 * Get products with optional filters
 * @param filters Optional filter parameters
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 12)
 * @returns Promise that resolves with product list response
 */
export async function getProducts(
  filters?: ProductFilter,
  page: number = 1,
  limit: number = 12,
): Promise<ProductListResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    let filteredProducts = [...MOCK_PRODUCTS];

    // Apply category filter
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filters.category,
      );
    }

    // Apply price range filter
    if (filters?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.minPrice!,
      );
    }

    if (filters?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filters.maxPrice!,
      );
    }

    // Apply rating filter
    if (filters?.minRating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= filters.minRating!,
      );
    }

    // Apply search query filter
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply tags filter
    if (filters?.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.tags!.some((tag) => product.tags.includes(tag)),
      );
    }

    // Apply sorting
    if (filters?.sortBy) {
      filteredProducts.sort((a, b) => {
        const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

        switch (filters.sortBy) {
          case 'name':
            return sortOrder * a.name.localeCompare(b.name);
          case 'price':
            return sortOrder * (a.price - b.price);
          case 'rating':
            return sortOrder * (a.rating - b.rating);
          case 'reviews':
            return sortOrder * (a.reviewsCount - b.reviewsCount);
          case 'newest':
            return sortOrder * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      products: paginatedProducts,
      total,
      page,
      pageSize: limit,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products. Please try again later.');
  }
}

/**
 * Get product by ID
 * @param id Product ID
 * @returns Promise that resolves with product
 */
export async function getProductById(id: string): Promise<Product> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const product = getMockProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product. Please try again later.');
  }
}

/**
 * Get reviews for a product
 * @param productId Product ID
 * @returns Promise that resolves with product reviews
 */
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const reviews = getReviewsByProductId(productId);

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw new Error('Failed to fetch product reviews. Please try again later.');
  }
}

/**
 * Search products by query
 * @param query Search query string
 * @returns Promise that resolves with matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    if (!query || query.trim() === '') {
      return [];
    }

    const searchQuery = query.toLowerCase();
    const results = MOCK_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
    );

    return results;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products. Please try again later.');
  }
}

/**
 * Get featured products
 * @returns Promise that resolves with featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Return products with rating >= 4.5 and at least 100 reviews
    const featuredProducts = MOCK_PRODUCTS.filter(
      (product) => product.rating >= 4.5 && product.reviewsCount >= 100,
    );

    // Sort by rating and reviews count
    featuredProducts.sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return b.reviewsCount - a.reviewsCount;
    });

    // Return top 8 featured products
    return featuredProducts.slice(0, 8);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products. Please try again later.');
  }
}

/**
 * Get all product categories
 * @returns Promise that resolves with product categories
 */
export async function getCategories(): Promise<ProductCategory[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Get unique categories from products
    const categories = Array.from(
      new Set(MOCK_PRODUCTS.map((product) => product.category)),
    );

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories. Please try again later.');
  }
}

/**
 * Get products by category
 * @param category Product category
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 12)
 * @returns Promise that resolves with product list response
 */
export async function getProductsByCategory(
  category: ProductCategory,
  page: number = 1,
  limit: number = 12,
): Promise<ProductListResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const categoryProducts = getMockProductsByCategory(category);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
    const total = categoryProducts.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      products: paginatedProducts,
      total,
      page,
      pageSize: limit,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category. Please try again later.');
  }
}

/**
 * Get related products
 * @param productId Product ID
 * @param limit Number of related products to return (default: 4)
 * @returns Promise that resolves with related products
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4,
): Promise<Product[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const product = getMockProductById(productId);

    if (!product) {
      return [];
    }

    // Get products from the same category
    const sameCategoryProducts = MOCK_PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== productId,
    );

    // Sort by rating and reviews count
    sameCategoryProducts.sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return b.reviewsCount - a.reviewsCount;
    });

    // Return top related products
    return sameCategoryProducts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw new Error('Failed to fetch related products. Please try again later.');
  }
}

/**
 * Get products by tag
 * @param tag Product tag
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 12)
 * @returns Promise that resolves with product list response
 */
export async function getProductsByTag(
  tag: string,
  page: number = 1,
  limit: number = 12,
): Promise<ProductListResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const tagProducts = MOCK_PRODUCTS.filter((product) =>
      product.tags.includes(tag),
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = tagProducts.slice(startIndex, endIndex);
    const total = tagProducts.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      products: paginatedProducts,
      total,
      page,
      pageSize: limit,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    throw new Error('Failed to fetch products by tag. Please try again later.');
  }
}

/**
 * Get popular tags
 * @param limit Number of tags to return (default: 10)
 * @returns Promise that resolves with popular tags
 */
export async function getPopularTags(limit: number = 10): Promise<string[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Count tag occurrences
    const tagCounts = new Map<string, number>();

    MOCK_PRODUCTS.forEach((product) => {
      product.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Sort by count and return top tags
    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, limit);

    return sortedTags;
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    throw new Error('Failed to fetch popular tags. Please try again later.');
  }
}
