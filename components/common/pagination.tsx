/**
 * Pagination Component
 *
 * Page navigation with previous/next buttons and numbered pages.
 * Supports ellipsis for large page counts.
 *
 * @module components/common
 */

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  /** Current active page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show on each side of current page */
  siblingCount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Generate page numbers with ellipsis
 */
function generatePaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | string)[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  // If total pages is small, show all
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  // Add ellipsis before range if needed
  if (leftSibling > 2) {
    pages.push("...");
  } else if (leftSibling === 2) {
    pages.push(2);
  }

  // Add middle range
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Add ellipsis after range if needed
  if (rightSibling < totalPages - 1) {
    pages.push("...");
  } else if (rightSibling === totalPages - 1) {
    pages.push(totalPages - 1);
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Pagination component for navigating through pages
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const pages = generatePaginationItems(currentPage, totalPages, siblingCount);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "ghost"}
              size="icon-sm"
              className={cn(
                "h-8 w-8 text-sm",
                isActive && "pointer-events-none"
              )}
              onClick={() => handlePageClick(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

export default Pagination;
