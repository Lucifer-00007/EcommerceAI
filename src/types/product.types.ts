// Product type definitions
// TypeScript types for product-related data structures

/**
 * Enumeration of available product categories in the eCommerce platform
 */
export enum ProductCategory {
  Electronics = 'Electronics',
  Clothing = 'Clothing',
  Home = 'Home',
  Sports = 'Sports',
  Books = 'Books',
  Beauty = 'Beauty',
  Toys = 'Toys',
}

/**
 * Represents a product review submitted by a user
 */
export interface ProductReview {
  /** Unique identifier for the review */
  readonly id: string;
  /** ID of the product being reviewed */
  readonly productId: string;
  /** ID of the user who wrote the review */
  readonly userId: string;
  /** Display name of the reviewer */
  readonly userName: string;
  /** Rating given by the user (1-5 stars) */
  readonly rating: number;
  /** Review comment/text */
  readonly comment: string;
  /** Timestamp when the review was created */
  readonly createdAt: string;
}

/**
 * Represents a product in the eCommerce catalog
 */
export interface Product {
  /** Unique identifier for the product */
  readonly id: string;
  /** Product name/title */
  name: string;
  /** Detailed product description */
  description: string;
  /** Current selling price */
  price: number;
  /** Original price before discount (optional) */
  originalPrice?: number;
  /** Array of product image URLs */
  images: readonly string[];
  /** Product category */
  category: ProductCategory;
  /** Average rating (0-5) */
  rating: number;
  /** Total number of reviews */
  reviewsCount: number;
  /** Available stock quantity */
  stock: number;
  /** Product tags for filtering/search */
  tags: readonly string[];
  /** Timestamp when the product was created */
  readonly createdAt: string;
  /** Timestamp when the product was last updated */
  readonly updatedAt: string;
}

/**
 * Options for sorting product results
 */
export enum ProductSortBy {
  Name = 'name',
  Price = 'price',
  Rating = 'rating',
  Reviews = 'reviews',
  Newest = 'newest',
}

/**
 * Options for sort order
 */
export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

/**
 * Filter parameters for querying products
 */
export interface ProductFilter {
  /** Filter by product category (optional) */
  category?: ProductCategory;
  /** Minimum price filter (optional) */
  minPrice?: number;
  /** Maximum price filter (optional) */
  maxPrice?: number;
  /** Minimum rating filter (optional) */
  minRating?: number;
  /** Search query string (optional) */
  searchQuery?: string;
  /** Field to sort by (optional) */
  sortBy?: ProductSortBy;
  /** Sort order (optional) */
  sortOrder?: SortOrder;
  /** Filter by tags (optional) */
  tags?: readonly string[];
}

/**
 * Paginated response containing product list
 */
export interface ProductListResponse {
  /** Array of products for the current page */
  products: readonly Product[];
  /** Total number of products matching the filter */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of products per page */
  pageSize: number;
  /** Whether there are more pages available */
  hasMore: boolean;
}

/**
 * Parameters for creating a new product (admin only)
 */
export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  tags?: string[];
}

/**
 * Parameters for updating an existing product (admin only)
 */
export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  category?: ProductCategory;
  stock?: number;
  tags?: string[];
}

/**
 * Parameters for submitting a product review
 */
export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
}
