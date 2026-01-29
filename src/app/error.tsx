/**
 * Error Boundary
 * 
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the app.
 * 
 * This is a Client Component ("use client") because error boundaries
 * must be client-side to catch rendering errors.
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Error Component Props
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary Component
 * Displays when an error occurs during rendering
 */
export default function ErrorBoundary({ error, reset }: ErrorProps) {
  // Log error to monitoring service
  useEffect(() => {
    // In production, send to error tracking service like Sentry
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        {/* Error Title */}
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>

        {/* Error Description */}
        <p className="mb-6 text-muted-foreground">
          We apologize for the inconvenience. An unexpected error has occurred.
          Our team has been notified.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg bg-muted p-4 text-left">
            <p className="mb-2 text-sm font-medium text-foreground">
              Error details:
            </p>
            <pre className="overflow-auto rounded bg-background p-2 text-xs text-destructive">
              {error.message}
              {"\n"}
              {error.stack}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
