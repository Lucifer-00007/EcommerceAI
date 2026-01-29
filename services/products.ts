/**
 * Products Service
 *
 * Product-related API functions with mock data implementation.
 * Ready to swap for real API calls by replacing the function bodies.
 *
 * @module services/products
 */

import type {
  Product,
  Category,
  ProductFilters,
  PaginationParams,
  PaginatedResponse,
  SortOption,
} from "@/types";
import {
  mockProducts,
  mockCategories,
  categoriesWithHierarchy,
  delay,
  simulateError,
  getRelatedProducts,
  searchProducts,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "./mock-data";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Get products parameters
 */
export interface GetProductsParams extends PaginationParams {
  /** Filter options */
  filters?: ProductFilters;
  /** Category slug or ID */
  category?: string;
  /** Search query */
  search?: string;
  /** Sort option */
  sortBy?: SortOption;
}

/**
 * Search products result
 */
export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

// =============================================================================
// PRODUCTS API
// =============================================================================

/**
 * Get paginated products with filters
 *
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Promise<PaginatedResponse<Product>>
 *
 * @example
 * const { data, pagination } = await getProducts({
 *   page: 1,
 *   limit: 20,
 *   filters: { priceRange: { min: 100, max: 500 } }
 * });
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  // Simulate network delay
  await delay(300, 600);
  simulateError(0.02); // 2% error rate

  const {
    page = 1,
    limit = 20,
    filters,
    category,
    search,
    sortBy = "featured",
    sort,
    order = "desc",
  } = params;

  let products = [...mockProducts];

  // Filter by search query
  if (search) {
    const query = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filter by category
  if (category) {
    products = products.filter(
      (p) => p.categoryId === category || p.categoryIds?.includes(category)
    );
  }

  // Apply advanced filters
  if (filters) {
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      products = products.filter((p) => {
        if (min !== undefined && p.price < min) return false;
        if (max !== undefined && p.price > max) return false;
        return true;
      });
    }

    if (filters.rating) {
      products = products.filter((p) => p.rating >= filters.rating!);
    }

    if (filters.inStock) {
      products = products.filter((p) => p.inventory > 0);
    }

    if (filters.featured) {
      products = products.filter((p) => p.isFeatured);
    }

    if (filters.onSale) {
      products = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    if (filters.tags && filters.tags.length > 0) {
      products = products.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }
  }

  // Sort products
  const sortField = sort || sortBy;
  products.sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "price-asc":
        comparison = a.price - b.price;
        break;
      case "price-desc":
        comparison = b.price - a.price;
        break;
      case "name-asc":
        comparison = a.name.localeCompare(b.name);
        break;
      case "name-desc":
        comparison = b.name.localeCompare(a.name);
        break;
      case "rating":
        comparison = b.rating - a.rating;
        break;
      case "newest":
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      case "bestselling":
        comparison = b.reviewCount - a.reviewCount;
        break;
      case "reviews":
        comparison = b.reviewCount - a.reviewCount;
        break;
      case "featured":
      default:
        // Featured products first, then by rating
        if (a.isFeatured && !b.isFeatured) comparison = -1;
        else if (!a.isFeatured && b.isFeatured) comparison = 1;
        else comparison = b.rating - a.rating;
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });

  // Calculate pagination
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return {
    data: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Get a single product by ID
 *
 * @param id - Product ID
 * @returns Promise<Product>
 * @throws Error if product not found
 *
 * @example
 * const product = await getProductById("prod_macbook_pro_16");
 */
export async function getProductById(id: string): Promise<Product> {
  await delay(200, 400);
  simulateError(0.05);

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    throw new Error(`Product with ID "${id}" not found`);
  }

  return product;
}

/**
 * Get a product by its slug
 *
 * @param slug - Product slug
 * @returns Promise<Product>
 * @throws Error if product not found
 *
 * @example
 * const product = await getProductBySlug("macbook-pro-16");
 */
export async function getProductBySlugAsync(slug: string): Promise<Product> {
  await delay(200, 400);
  simulateError(0.05);

  const product = getProductBySlug(slug);

  if (!product) {
    throw new Error(`Product with slug "${slug}" not found`);
  }

  return product;
}

// Alias for consistency
export { getProductBySlugAsync as getProductBySlug };

/**
 * Get all categories
 *
 * @param includeInactive - Whether to include inactive categories
 * @returns Promise<Category[]>
 *
 * @example
 * const categories = await getCategories();
 */
export async function getCategories(includeInactive = false): Promise<Category[]> {
  await delay(150, 300);
  simulateError(0.02);

  let categories = [...categoriesWithHierarchy];

  if (!includeInactive) {
    categories = categories.filter((c) => c.isActive !== false);
  }

  // Sort by sortOrder
  categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return categories;
}

/**
 * Get a category by slug with its products
 *
 * @param slug - Category slug
 * @returns Promise<{ category: Category; products: Product[] }>
 * @throws Error if category not found
 *
 * @example
 * const { category, products } = await getCategoryBySlugAsync("laptops");
 */
export async function getCategoryBySlugAsync(
  slug: string
): Promise<{ category: Category; products: Product[] }> {
  await delay(300, 500);
  simulateError(0.03);

  const category = getCategoryBySlug(slug);

  if (!category) {
    throw new Error(`Category with slug "${slug}" not found`);
  }

  // Get products for this category
  let products = getProductsByCategory(category.id);

  // Include products from child categories
  if (category.children && category.children.length > 0) {
    const childIds = category.children.map((c) => c.id);
    const childProducts = mockProducts.filter((p) =>
      p.categoryIds?.some((id) => childIds.includes(id))
    );
    products = [...products, ...childProducts];
  }

  // Remove duplicates
  products = Array.from(new Map(products.map((p) => [p.id, p])).values());

  return { category, products };
}

// Alias for consistency
export { getCategoryBySlugAsync as getCategoryBySlug };

/**
 * Get related products for a given product
 *
 * @param productId - Product ID to find related products for
 * @param limit - Maximum number of products to return
 * @returns Promise<Product[]>
 *
 * @example
 * const related = await getRelatedProducts("prod_macbook_pro_16", 4);
 */
export async function getRelatedProductsAsync(
  productId: string,
  limit = 4
): Promise<Product[]> {
  await delay(250, 450);
  simulateError(0.02);

  return getRelatedProducts(productId, limit);
}

// Alias for consistency
export { getRelatedProductsAsync as getRelatedProducts };

/**
 * Search products by query string
 *
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Promise<SearchResult>
 *
 * @example
 * const { products, total } = await searchProducts("laptop");
 */
export async function searchProductsAsync(
  query: string,
  limit = 20
): Promise<SearchResult> {
  await delay(300, 600);
  simulateError(0.03);

  if (!query.trim()) {
    return { products: [], total: 0, query };
  }

  const results = searchProducts(query).slice(0, limit);

  return {
    products: results,
    total: results.length,
    query,
  };
}

// Alias for consistency
export { searchProductsAsync as searchProducts };

/**
 * Get featured products
 *
 * @param limit - Maximum number of products to return
 * @returns Promise<Product[]>
 *
 * @example
 * const featured = await getFeaturedProducts(6);
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  await delay(200, 400);
  simulateError(0.02);

  return mockProducts
    .filter((p) => p.isFeatured && p.isActive !== false)
    .slice(0, limit);
}

/**
 * Get products on sale
 *
 * @param limit - Maximum number of products to return
 * @returns Promise<Product[]>
 *
 * @example
 * const saleItems = await getSaleProducts(10);
 */
export async function getSaleProducts(limit = 10): Promise<Product[]> {
  await delay(200, 400);
  simulateError(0.02);

  return mockProducts
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .slice(0, limit);
}

/**
 * Get new arrivals (recently added products)
 *
 * @param limit - Maximum number of products to return
 * @returns Promise<Product[]>
 *
 * @example
 * const newProducts = await getNewArrivals(8);
 */
export async function getNewArrivals(limit = 8): Promise<Product[]> {
  await delay(200, 400);
  simulateError(0.02);

  return [...mockProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Get product recommendations based on product ID
 *
 * @param productId - Product ID
 * @param limit - Maximum number of recommendations
 * @returns Promise<Product[]>
 *
 * @example
 * const recommendations = await getProductRecommendations("prod_123", 4);
 */
export async function getProductRecommendations(
  productId: string,
  limit = 4
): Promise<Product[]> {
  await delay(300, 500);
  simulateError(0.02);

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return [];
  }

  // Find products in same category with similar price
  return mockProducts
    .filter(
      (p) =>
        p.id !== productId &&
        (p.categoryId === product.categoryId ||
          p.categoryIds?.some((id) => product.categoryIds?.includes(id)))
    )
    .sort((a, b) => {
      // Sort by price similarity
      const aDiff = Math.abs(a.price - product.price);
      const bDiff = Math.abs(b.price - product.price);
      return aDiff - bDiff;
    })
    .slice(0, limit);
}
