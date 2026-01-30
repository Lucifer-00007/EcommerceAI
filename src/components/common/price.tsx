/**
 * Price Component
 *
 * Displays formatted currency amounts with support for sale prices and savings badges.
 * Handles currency formatting and sale display logic.
 *
 * @module components/common
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface PriceProps {
  /** The amount to display */
  amount: number;
  /** Currency code (ISO 4217, default: USD) */
  currency?: string;
  /** Original price to show with strikethrough for sales */
  compareAtPrice?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show savings percentage badge */
  showSavings?: boolean;
}

/**
 * Format a number as currency
 */
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Price component for displaying currency with sale formatting
 *
 * @example
 * ```tsx
 * // Regular price
 * <Price amount={99.99} />
 *
 * // Sale price with compare
 * <Price
 *   amount={79.99}
 *   compareAtPrice={99.99}
 *   showSavings
 * />
 * ```
 */
export function Price({
  amount,
  currency = "USD",
  compareAtPrice,
  className,
  showSavings = false,
}: PriceProps) {
  const isOnSale = compareAtPrice && compareAtPrice > amount;
  const savingsPercent = isOnSale
    ? Math.round(((compareAtPrice - amount) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Current Price */}
      <span
        className={cn(
          "font-semibold",
          isOnSale ? "text-destructive" : "text-foreground"
        )}
      >
        {formatCurrency(amount, currency)}
      </span>

      {/* Compare At Price (strikethrough) */}
      {isOnSale && (
        <span className="text-sm text-muted-foreground line-through">
          {formatCurrency(compareAtPrice, currency)}
        </span>
      )}

      {/* Savings Badge */}
      {isOnSale && showSavings && savingsPercent > 0 && (
        <Badge
          variant="secondary"
          className="bg-success/20 text-success hover:bg-success/30"
        >
          Save {savingsPercent}%
        </Badge>
      )}
    </div>
  );
}

export default Price;
