/**
 * Common Components
 *
 * Reusable UI components used across the eCommerce application.
 * All components extend shadcn/ui with business-specific functionality.
 *
 * @module components/common
 */

// Product Components
export { ProductCard } from "./product-card";
export type { ProductCardProps } from "./product-card";

export { ProductSkeleton } from "./product-skeleton";
export type { ProductSkeletonProps } from "./product-skeleton";

// Form Components
export { QuantitySelector } from "./quantity-selector";
export type { QuantitySelectorProps } from "./quantity-selector";

export { StarRating } from "./star-rating";
export type { StarRatingProps } from "./star-rating";

export { Price } from "./price";
export type { PriceProps } from "./price";

export { SortSelect } from "./sort-select";
export type { SortSelectProps } from "./sort-select";

export { Filters } from "./filters";
export type { FiltersProps } from "./filters";

// Navigation Components
export { Breadcrumb } from "./breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./breadcrumb";

export { Pagination } from "./pagination";
export type { PaginationProps } from "./pagination";

// State Components
export { EmptyState } from "./empty-state";
export type { EmptyStateProps, EmptyStateAction } from "./empty-state";

export { ErrorFallback } from "./error-fallback";
export type { ErrorFallbackProps } from "./error-fallback";
