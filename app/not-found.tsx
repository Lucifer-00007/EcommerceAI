/**
 * 404 Not Found Page
 * 
 * Displayed when a user navigates to a non-existent route.
 * This is a Server Component by default.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

/**
 * Metadata for the 404 page
 */
export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

/**
 * Not Found Page Component
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md text-center">
        {/* 404 Icon */}
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* 404 Code */}
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          404 Error
        </p>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>

        {/* Description */}
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might
          have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
