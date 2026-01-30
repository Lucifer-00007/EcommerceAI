/**
 * Card Component
 * 
 * A flexible container component for grouping related content.
 * Composed of multiple sub-components for header, content, and footer.
 * 
 * Features:
 * - Clean, elevated container with rounded corners
 * - Composable structure with CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 * - Consistent padding and spacing
 * - Accessible structure
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// CARD ROOT
// ============================================================================

/**
 * Card container component
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

// ============================================================================
// CARD HEADER
// ============================================================================

/**
 * Card header section
 * Typically contains CardTitle and CardDescription
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

// ============================================================================
// CARD TITLE
// ============================================================================

/**
 * Card title heading
 * Use this for the main heading of the card
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

// ============================================================================
// CARD DESCRIPTION
// ============================================================================

/**
 * Card description text
 * Use this for secondary text that describes the card content
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

// ============================================================================
// CARD CONTENT
// ============================================================================

/**
 * Card content section
 * Main content area of the card
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

// ============================================================================
// CARD FOOTER
// ============================================================================

/**
 * Card footer section
 * Typically contains action buttons or additional information
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
