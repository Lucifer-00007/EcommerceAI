import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Product, SearchParams } from '@/types'

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: SearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
}

// Hook for fetching products with filters and pagination
export function useProducts(params?: SearchParams) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => apiService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
  })
}

// Hook for fetching a single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiService.getProductById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for fetching featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => apiService.getFeaturedProducts(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Hook for prefetching product details
export function usePrefetchProduct() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => apiService.getProductById(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  }
}
