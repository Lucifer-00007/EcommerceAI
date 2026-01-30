/**
 * Label Component
 * 
 * A form label component built on Radix UI's Label primitive.
 * Provides proper association with form controls for accessibility.
 * 
 * Features:
 * - Automatic association with form controls via htmlFor
 * - Required indicator styling
 * - Disabled state styling
 */

'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ============================================================================
// STYLES
// ============================================================================

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

// ============================================================================
// TYPES
// ============================================================================

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** When true, shows a required indicator */
  required?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Label component
 * 
 * @example
 * // Basic label
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" />
 * 
 * // Required field
 * <Label htmlFor="name" required>Name</Label>
 * <Input id="name" required />
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="text-destructive ml-1" aria-hidden="true">*</span>
    )}
    {required && (
      <span className="sr-only">(required)</span>
    )}
  </LabelPrimitive.Root>
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
