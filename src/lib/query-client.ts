import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (failureCount >= 2) return false;
          if (error instanceof Error && "status" in error) {
            const status = (error as { status?: unknown }).status;
            if (typeof status === "number") return status >= 500;
          }
          return true;
        },
        refetchOnWindowFocus: false,
        staleTime: 15_000,
      },
    },
  });
}

