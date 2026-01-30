/**
 * Query Provider Component
 * 
 * Provides React Query (TanStack Query) context to the application.
 * Configures global query defaults and caching behavior.
 * 
 * Features:
 * - Global query configuration
 * - Error handling
 * - Caching strategy
 * - DevTools integration (development only)
 */

'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

/**
 * Creates a new QueryClient with global configuration
 * 
 * This function is called once per application lifecycle to ensure
 * the same QueryClient instance is used across the app.
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        // After this time, the data is considered stale and will be refetched on next access
        staleTime: 5 * 60 * 1000, // 5 minutes
        
        // Time in milliseconds that inactive data remains in cache
        // After this time, the cached data is garbage collected
        gcTime: 10 * 60 * 1000, // 10 minutes
        
        // Number of retry attempts for failed queries
        retry: 2,
        
        // Delay between retry attempts (in milliseconds)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch data when window regains focus
        // Good for ensuring data is fresh when user returns to the app
        refetchOnWindowFocus: false,
        
        // Refetch data when network reconnects
        refetchOnReconnect: true,
        
        // Show previous data while fetching new data
        // Provides better UX by avoiding loading states
        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        // Number of retry attempts for failed mutations
        retry: 1,
        
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  })
}

// ============================================================================
// CONTEXT
// ============================================================================

/**
 * Context to share the QueryClient instance
 * This allows child components to access the QueryClient if needed
 */
const QueryClientContext = React.createContext<QueryClient | undefined>(undefined)

/**
 * Hook to access the QueryClient instance
 * 
 * @example
 * const queryClient = useQueryClient()
 * queryClient.invalidateQueries({ queryKey: ['products'] })
 */
export function useQueryClient() {
  const context = React.useContext(QueryClientContext)
  if (!context) {
    throw new Error('useQueryClient must be used within a QueryProvider')
  }
  return context
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * Props for the QueryProvider component
 */
interface QueryProviderProps {
  /** Child components */
  children: React.ReactNode
}

/**
 * Query Provider Component
 * 
 * Wraps the application with React Query's QueryClientProvider.
 * Creates a single QueryClient instance that persists across renders.
 * 
 * @example
 * // In your root layout:
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create the QueryClient instance once
  // Using useState with a function ensures it's only created once
  const [queryClient] = React.useState(() => createQueryClient())

  return (
    <QueryClientContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <React.Suspense fallback={null}>
            {/* Dynamic import to avoid bundling in production */}
            <ReactQueryDevtools />
          </React.Suspense>
        )}
      </QueryClientProvider>
    </QueryClientContext.Provider>
  )
}

/**
 * Lazy-loaded React Query DevTools
 * Only loaded in development mode
 */
function ReactQueryDevtools() {
  const { ReactQueryDevtools: Devtools } = require('@tanstack/react-query-devtools')
  return <Devtools initialIsOpen={false} />
}
