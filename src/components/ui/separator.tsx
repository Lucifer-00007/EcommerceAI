/**
 * Separator Component
 * 
 * A visual divider that separates content into distinct groups.
 * Built on Radix UI's Separator primitive for accessibility.
 * 
 * Features:
 * - Horizontal and vertical orientations
 * - Accessible (announced to screen readers)
 * - Decorative option (hidden from screen readers)
 */

'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

/**
 * Separator component
 * 
 * @example
 * // Horizontal separator (default)
 * <Separator />
 * 
 * // Vertical separator
 * <Separator orientation="vertical" />
 * 
 * // Decorative (hidden from screen readers)
 * <Separator decorative />
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
)

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
