/**
 * Badge Component
 * 
 * A small status indicator for highlighting items, showing counts,
 * or indicating state.
 * 
 * Features:
 * - Multiple visual variants (default, secondary, destructive, outline)
 * - Compact size for inline use
 * - Accessible styling
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ============================================================================
// STYLES
// ============================================================================

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        /**
         * Default variant - primary color scheme
         */
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        /**
         * Secondary variant - muted color scheme
         */
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        /**
         * Destructive variant - red color scheme for errors/warnings
         */
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        /**
         * Outline variant - bordered style with transparent background
         */
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// ============================================================================
// TYPES
// ============================================================================

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Badge component
 * 
 * @example
 * // Default badge
 * <Badge>New</Badge>
 * 
 * // Destructive badge
 * <Badge variant="destructive">Error</Badge>
 * 
 * // Outline badge
 * <Badge variant="outline">Draft</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
