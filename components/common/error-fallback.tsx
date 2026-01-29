/**
 * Error Fallback Component
 *
 * Displayed when an error occurs. Shows error message with alert icon
 * and optional retry button.
 *
 * @module components/common
 */

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ErrorFallbackProps {
  /** Error title (optional, defaults to "Something went wrong") */
  title?: string;
  /** Error message to display */
  message: string;
  /** Callback when retry button is clicked */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Error fallback component for displaying errors
 *
 * @example
 * ```tsx
 * <ErrorFallback
 *   title="Failed to load products"
 *   message="There was an error loading the product catalog. Please try again."
 *   onRetry={refetch}
 * />
 * ```
 */
export function ErrorFallback({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorFallbackProps) {
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {message}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardFooter className="justify-center pb-6">
          <Button onClick={onRetry} variant="default">
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default ErrorFallback;
