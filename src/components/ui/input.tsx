/**
 * Input Component
 * 
 * A form input component with consistent styling and accessibility features.
 * 
 * Features:
 * - Consistent styling with the design system
 * - Focus states with ring indicator
 * - Error state styling
 * - Disabled state styling
 * - Full width by default
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Props for the Input component
 * Extends native input props with optional error state
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** When true, applies error styling */
  error?: boolean
  /** Optional helper text displayed below the input */
  helperText?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Input component
 * 
 * @example
 * // Basic input
 * <Input placeholder="Enter your name" />
 * 
 * // With error state
 * <Input error helperText="This field is required" />
 * 
 * // Disabled input
 * <Input disabled value="Cannot edit" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            // Error state styling
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {helperText && (
          <p className={cn(
            'mt-1 text-sm',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
