// Product hooks
// Custom hooks for product-related functionality

import { useQuery } from '@tanstack/react-query';
import type {
  Product,
  ProductCategory,
  ProductFilter,
  ProductListResponse,
} from '@/types/product.types';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  searchProducts,
  getRelatedProducts,
} from '@/services/products.service';

/**
 * Hook for fetching products with filters and pagination
 * @param filters - Optional filter parameters
 * @param page - Page number (default: 1)
 * @param limit - Number of items per page (default: 12)
 * @returns Query result with products data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProducts(
 *   { category: ProductCategory.Electronics, minRating: 4 },
 *   1,
 *   12
 * );
 * ```
 */
export function useProducts(
  filters?: ProductFilter,
  page: number = 1,
  limit: number = 12,
) {
  return useQuery<ProductListResponse>({
    queryKey: ['products', filters, page, limit],
    queryFn: () => getProducts(filters, page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a single product by ID
 * @param id - Product ID
 * @returns Query result with product data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: product, isLoading, error } = useProductById('prod-123');
 * ```
 */
export function useProductById(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for fetching featured products
 * @returns Query result with featured products data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: featuredProducts, isLoading, error } = useFeaturedProducts();
 * ```
 */
export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook for fetching all product categories
 * @returns Query result with categories data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading, error } = useCategories();
 * ```
 */
export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook for searching products by query
 * @param query - Search query string
 * @returns Query result with search results, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: searchResults, isLoading, error } = useSearchProducts('laptop');
 * ```
 */
export function useSearchProducts(query: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook for fetching related products
 * @param productId - Product ID to find related products for
 * @param limit - Number of related products to return (default: 4)
 * @returns Query result with related products data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: relatedProducts, isLoading, error } = useRelatedProducts('prod-123', 4);
 * ```
 */
export function useRelatedProducts(productId: string, limit: number = 4) {
  return useQuery<Product[]>({
    queryKey: ['products', 'related', productId, limit],
    queryFn: () => getRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
