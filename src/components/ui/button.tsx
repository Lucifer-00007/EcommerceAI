/**
 * Button Component
 * 
 * A versatile, accessible button component built on Radix UI's Slot primitive.
 * Supports multiple variants, sizes, and states with full keyboard accessibility.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, ghost, link)
 * - Multiple sizes (default, sm, lg, icon)
 * - Loading state with spinner
 * - Full keyboard accessibility
 * - Polymorphic rendering (asChild prop)
 * - Disabled state styling
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// STYLES
// ============================================================================

/**
 * Button variants using class-variance-authority
 * This provides type-safe variant props with Tailwind CSS classes
 */
const buttonVariants = cva(
  // Base styles applied to all button variants
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /**
         * Default variant - primary action style
         * Uses the primary color for background
         */
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        /**
         * Destructive variant - for dangerous actions
         * Uses red color scheme
         */
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        /**
         * Outline variant - bordered style
         * Transparent background with border
         */
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        /**
         * Secondary variant - less prominent than default
         * Uses secondary color scheme
         */
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        /**
         * Ghost variant - minimal style
         * Transparent background, only shows on hover
         */
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        /**
         * Link variant - looks like a text link
         * Underlined text with no background
         */
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        /**
         * Default size - comfortable for most use cases
         */
        default: 'h-10 px-4 py-2',
        /**
         * Small size - for compact UIs
         */
        sm: 'h-9 rounded-md px-3',
        /**
         * Large size - for prominent actions
         */
        lg: 'h-11 rounded-md px-8',
        /**
         * Icon size - square button for icons only
         */
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// ============================================================================
// TYPES
// ============================================================================

/**
 * Props for the Button component
 * Extends native button props with variant/size options and loading state
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, the button will render its child as the root element */
  asChild?: boolean
  /** When true, shows a loading spinner and disables the button */
  isLoading?: boolean
  /** Text shown when loading (for screen readers) */
  loadingText?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Button component
 * 
 * @example
 * // Default button
 * <Button>Click me</Button>
 * 
 * // Destructive variant
 * <Button variant="destructive">Delete</Button>
 * 
 * // Loading state
 * <Button isLoading loadingText="Saving...">Save</Button>
 * 
 * // As a link
 * <Button asChild variant="link">
 *   <a href="/path">Go to page</a>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    ...props 
  }, ref) => {
    // Use Slot for polymorphic rendering when asChild is true
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span className="sr-only">{loadingText}</span>
            <span aria-hidden="true">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
