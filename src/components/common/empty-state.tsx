/**
 * Empty State Component
 *
 * Displayed when there's no data to show (empty cart, no search results, etc.).
 * Includes icon, title, description, and optional action button.
 *
 * @module components/common
 */

import * as React from "react";
import Link from "next/link";
import { LucideIcon, Package } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateAction {
  /** Label for the action button */
  label: string;
  /** Click handler (for on-page actions) */
  onClick?: () => void;
  /** URL href (for navigation actions) */
  href?: string;
}

export interface EmptyStateProps {
  /** Icon component to display */
  icon?: LucideIcon;
  /** Title text */
  title: string;
  /** Description text (optional) */
  description?: string;
  /** Action button configuration (optional) */
  action?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Empty state component for when there's no content to display
 *
 * @example
 * ```tsx
 * // Empty cart
 * <EmptyState
 *   icon={ShoppingCart}
 *   title="Your cart is empty"
 *   description="Browse our products and add items to your cart."
 *   action={{ label: "Continue Shopping", href: "/products" }}
 * />
 *
 * // No search results
 * <EmptyState
 *   icon={Search}
 *   title="No results found"
 *   description="Try adjusting your search terms or filters."
 *   action={{ label: "Clear Filters", onClick: handleClearFilters }}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
    >
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Action */}
      {action && (
        <div className="pt-2">
          {action.href ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
