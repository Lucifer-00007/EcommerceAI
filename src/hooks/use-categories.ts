import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Category } from '@/types'

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
}

// Hook for fetching all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => apiService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change rarely
  })
}

// Hook for fetching a single category by slug
export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => apiService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
