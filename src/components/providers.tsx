'use client';

// Providers component
// Wraps the application with necessary providers (QueryClient, ThemeProvider, etc.)

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { useState, type ReactNode } from 'react';

/**
 * Providers component props
 */
interface ProvidersProps {
  /** Child components to wrap */
  children: ReactNode;
}

/**
 * Providers component
 * Wraps the application with TanStack Query and Theme providers
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
