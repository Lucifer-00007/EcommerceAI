/**
 * Skeleton Component
 * 
 * A loading placeholder that mimics the shape of content while it's loading.
 * Used to improve perceived performance and reduce layout shift.
 * 
 * Features:
 * - Animated pulse effect
 * - Flexible sizing
 * - Can be composed to match any content shape
 * - Accessible (hidden from screen readers)
 */

import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface SkeletonProps {
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Skeleton loading placeholder
 * 
 * @example
 * // Basic skeleton
 * <Skeleton className="h-4 w-[250px]" />
 * 
 * // Card skeleton
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-[250px]" />
 *   <Skeleton className="h-4 w-[200px]" />
 * </div>
 * 
 * // Circle skeleton (for avatars)
 * <Skeleton className="h-12 w-12 rounded-full" />
 */
function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      // Hide from screen readers as this is decorative
      aria-hidden="true"
    />
  )
}

export { Skeleton }
