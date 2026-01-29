/**
 * Product Skeleton Component
 *
 * Loading placeholder that mimics ProductCard layout with animated pulse effect.
 * Used for showing loading states while product data is being fetched.
 *
 * @module components/common
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ProductSkeletonProps {
  /** Visual variant matching ProductCard variants */
  variant?: "card" | "detail";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Product skeleton for loading states
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <>
 *     <ProductSkeleton />
 *     <ProductSkeleton />
 *     <ProductSkeleton />
 *   </>
 * ) : (
 *   products.map(p => <ProductCard key={p.id} product={p} />)
 * )}
 * ```
 */
export function ProductSkeleton({
  variant = "card",
  className,
}: ProductSkeletonProps) {
  if (variant === "detail") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-2 lg:gap-12", className)}>
        {/* Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          {/* Thumbnail Row */}
          <div className="flex gap-2">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Variant Selectors */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-12 w-full" />

          {/* Additional Info */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Card variant (matches ProductCard default variant)
  return (
    <div
      className={cn(
        "flex flex-col gap-3 overflow-hidden rounded-xl border bg-card p-0",
        className
      )}
    >
      {/* Image Placeholder */}
      <Skeleton className="aspect-[4/3] w-full rounded-t-xl rounded-b-none" />

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Rating */}
        <div className="flex items-center gap-1 py-1">
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
