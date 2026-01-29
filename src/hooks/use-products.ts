/**
 * Product Hooks
 *
 * React Query hooks for product data fetching with caching and pagination.
 *
 * @module hooks/use-products
 * @example
 * const { data, isLoading } = useProducts({ category: "laptops" });
 * const { data: product } = useProduct("prod_123");
 */

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import type {
  Product,
  Category,
  ProductFilters,
  PaginatedResponse,
  PaginationParams,
  SortOption,
} from "@/types";
import {
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
} from "@/services/products";

// =============================================================================
// QUERY KEYS
// =============================================================================

/**
 * Query keys for product-related queries
 * Follows React Query best practices for cache management
 */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  infinite: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), "infinite", filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.details(), "slug", slug] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  category: (slug: string) => [...productKeys.categories(), slug] as const,
  related: (id: string) => [...productKeys.detail(id), "related"] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
  featured: () => [...productKeys.all, "featured"] as const,
  sale: () => [...productKeys.all, "sale"] as const,
  new: () => [...productKeys.all, "new"] as const,
  recommendations: (id: string) =>
    [...productKeys.detail(id), "recommendations"] as const,
};

// =============================================================================
// TYPES
// =============================================================================

/**
 * Products query filters
 */
interface UseProductsFilters extends Partial<PaginationParams> {
  /** Category ID or slug */
  category?: string;
  /** Search query */
  search?: string;
  /** Advanced filters */
  filters?: ProductFilters;
  /** Sort option */
  sortBy?: SortOption;
}

// =============================================================================
// PRODUCT QUERIES
// =============================================================================

/**
 * Hook to fetch products with pagination
 *
 * @param params - Query parameters including filters, pagination, and sorting
 * @param options - Additional React Query options
 * @returns Query result with products and pagination info
 *
 * @example
 * const { data, isLoading, error } = useProducts({
 *   category: "laptops",
 *   page: 1,
 *   limit: 20,
 *   sortBy: "price-asc"
 * });
 */
export function useProducts(
  params: UseProductsFilters = {},
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Product>, Error>,
    "queryKey" | "queryFn"
  >
) {
  const { category, search, filters, sortBy, page = 1, limit = 20, ...rest } = params;

  return useQuery({
    queryKey: productKeys.list({ category, search, filters, sortBy, page, limit }),
    queryFn: () =>
      getProducts({
        category,
        search,
        filters,
        sortBy,
        page,
        limit,
        ...rest,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Hook to fetch products with infinite scrolling
 *
 * @param params - Query parameters
 * @param options - Additional React Query options
 * @returns Infinite query result with products
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteProducts({
 *   category: "laptops",
 *   limit: 20
 * });
 */
export function useInfiniteProducts(
  params: Omit<UseProductsFilters, "page"> = {},
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<Product>, Error>,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  >
) {
  const { category, search, filters, sortBy, limit = 20, ...rest } = params;

  return useInfiniteQuery({
    queryKey: productKeys.infinite({ category, search, filters, sortBy, limit }),
    queryFn: ({ pageParam }) =>
      getProducts({
        category,
        search,
        filters,
        sortBy,
        page: pageParam as number,
        limit,
        ...rest,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch a single product by ID
 *
 * @param id - Product ID
 * @param options - Additional React Query options
 * @returns Query result with product data
 *
 * @example
 * const { data: product, isLoading } = useProduct("prod_123");
 */
export function useProduct(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.detail(id || ""),
    queryFn: () => getProductById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.message?.includes("not found")) return false;
      return failureCount < 3;
    },
    ...options,
  });
}

/**
 * Hook to fetch a single product by slug
 *
 * @param slug - Product slug
 * @param options - Additional React Query options
 * @returns Query result with product data
 *
 * @example
 * const { data: product, isLoading } = useProductBySlug("macbook-pro-16");
 */
export function useProductBySlug(
  slug: string | undefined,
  options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.slug(slug || ""),
    queryFn: () => getProductBySlugAsync(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// CATEGORY QUERIES
// =============================================================================

/**
 * Hook to fetch all categories
 *
 * @param includeInactive - Whether to include inactive categories
 * @param options - Additional React Query options
 * @returns Query result with categories
 *
 * @example
 * const { data: categories } = useCategories();
 */
export function useCategories(
  includeInactive = false,
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => getCategories(includeInactive),
    staleTime: 10 * 60 * 1000, // Categories don't change often
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch a category with its products by slug
 *
 * @param slug - Category slug
 * @param options - Additional React Query options
 * @returns Query result with category and products
 *
 * @example
 * const { data: { category, products } } = useCategory("laptops");
 */
export function useCategory(
  slug: string | undefined,
  options?: Omit<
    UseQueryOptions<{ category: Category; products: Product[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.category(slug || ""),
    queryFn: () => getCategoryBySlugAsync(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// SEARCH QUERIES
// =============================================================================

/**
 * Hook to search products with debouncing
 *
 * @param query - Search query string
 * @param options - Additional React Query options
 * @returns Query result with search results
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState("");
 * const { data: results } = useSearchProducts(searchQuery);
 */
export function useSearchProducts(
  query: string,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  // Debounce the search query to avoid too many requests
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: productKeys.search(debouncedQuery),
    queryFn: async () => {
      const result = await searchProductsAsync(debouncedQuery);
      return result.products;
    },
    enabled: debouncedQuery.length >= 2, // Only search with 2+ characters
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous results while loading
    ...options,
  });
}

// =============================================================================
// RELATED PRODUCTS
// =============================================================================

/**
 * Hook to fetch related products for a product
 *
 * @param productId - Product ID to find related products for
 * @param limit - Maximum number of related products
 * @param options - Additional React Query options
 * @returns Query result with related products
 *
 * @example
 * const { data: related } = useRelatedProducts("prod_123", 4);
 */
export function useRelatedProducts(
  productId: string | undefined,
  limit = 4,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.related(productId || ""),
    queryFn: () => getRelatedProductsAsync(productId!, limit),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch product recommendations
 *
 * @param productId - Product ID
 * @param limit - Maximum number of recommendations
 * @param options - Additional React Query options
 * @returns Query result with recommended products
 *
 * @example
 * const { data: recommendations } = useProductRecommendations("prod_123", 4);
 */
export function useProductRecommendations(
  productId: string | undefined,
  limit = 4,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.recommendations(productId || ""),
    queryFn: () => getProductRecommendations(productId!, limit),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// FEATURED/SALE/NEW QUERIES
// =============================================================================

/**
 * Hook to fetch featured products
 *
 * @param limit - Maximum number of products
 * @param options - Additional React Query options
 * @returns Query result with featured products
 *
 * @example
 * const { data: featured } = useFeaturedProducts(6);
 */
export function useFeaturedProducts(
  limit = 6,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...productKeys.featured(), limit],
    queryFn: () => getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch products on sale
 *
 * @param limit - Maximum number of products
 * @param options - Additional React Query options
 * @returns Query result with sale products
 *
 * @example
 * const { data: saleItems } = useSaleProducts(10);
 */
export function useSaleProducts(
  limit = 10,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...productKeys.sale(), limit],
    queryFn: () => getSaleProducts(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch new arrivals
 *
 * @param limit - Maximum number of products
 * @param options - Additional React Query options
 * @returns Query result with new products
 *
 * @example
 * const { data: newProducts } = useNewArrivals(8);
 */
export function useNewArrivals(
  limit = 8,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...productKeys.new(), limit],
    queryFn: () => getNewArrivals(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Hook to refresh product data
 *
 * @returns Mutation to invalidate and refetch product queries
 *
 * @example
 * const refreshProducts = useRefreshProducts();
 * refreshProducts.mutate();
 */
export function useRefreshProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Hook to prefetch a product
 *
 * @returns Function to prefetch product data
 *
 * @example
 * const prefetchProduct = usePrefetchProduct();
 * prefetchProduct("prod_123");
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => getProductById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { UseProductsFilters };
