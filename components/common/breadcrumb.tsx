/**
 * Breadcrumb Component
 *
 * Navigation breadcrumb with home icon, chevron separators, and current page.
 * Improves navigation and accessibility for page hierarchy.
 *
 * @module components/common
 */

import * as React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  /** Display label for the breadcrumb item */
  label: string;
  /** URL href (undefined for current page) */
  href?: string;
  /** Optional icon identifier */
  icon?: string;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Additional CSS classes */
  className?: string;
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean;
}

/**
 * Breadcrumb navigation component
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Products", href: "/products" },
 *     { label: "Electronics", href: "/products/electronics" },
 *     { label: "iPhone 15" }, // Current page (no href)
 *   ]}
 * />
 * ```
 */
export function Breadcrumb({
  items,
  className,
  showHomeIcon = true,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
        {/* Home Link */}
        {showHomeIcon && (
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            {items.length > 0 && (
              <ChevronRight className="ml-1.5 h-4 w-4 text-muted-foreground/50" />
            )}
          </li>
        )}

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {isLast || !item.href ? (
                // Current page (not clickable)
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                // Navigable link
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}

              {/* Separator */}
              {!isLast && (
                <ChevronRight className="ml-1.5 h-4 w-4 text-muted-foreground/50" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
