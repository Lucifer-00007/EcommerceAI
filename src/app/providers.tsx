/**
 * Application Providers
 * 
 * This component wraps the entire application with necessary context providers:
 * - QueryProvider: TanStack Query for server state management
 * - ThemeProvider: next-themes for dark/light mode support
 * - Toaster: Sonner toast notifications
 * 
 * Order matters: Providers that depend on others should be nested inside.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

/**
 * Query Provider Configuration
 * Creates a new QueryClient with default options for the eCommerce app
 */
function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is only created once per session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time until data is considered stale (5 minutes)
            staleTime: 1000 * 60 * 5,
            // Time to keep data in cache after component unmounts (10 minutes)
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 2 times with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Don't refetch on window focus to reduce unnecessary requests
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect (we'll handle this manually if needed)
            refetchOnReconnect: false,
          },
          mutations: {
            // Retry mutations only once (mutations are usually more important)
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Theme Provider Configuration
 * Supports system, light, and dark modes
 */
function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Main Providers Component
 * Composes all providers in the correct order
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            // Default toast styling
            className: "border-border",
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
