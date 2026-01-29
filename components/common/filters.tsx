/**
 * Filters Component
 *
 * Product filtering panel with price range, categories, rating, and stock toggle.
 * Used on product listing pages to filter the catalog.
 *
 * @module components/common
 */

"use client";

import * as React from "react";
import { X, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductFilters, Category } from "@/types";
import { StarRating } from "./star-rating";

// Checkbox primitive
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

const CheckboxComp = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
CheckboxComp.displayName = CheckboxPrimitive.Root.displayName;

export interface FiltersProps {
  /** Current filter state */
  filters: ProductFilters;
  /** Callback when filters change */
  onChange: (filters: ProductFilters) => void;
  /** Available categories for filtering */
  categories: Category[];
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the clear button */
  showClearButton?: boolean;
}

/**
 * Product filters component
 *
 * @example
 * ```tsx
 * <Filters
 *   filters={currentFilters}
 *   onChange={setFilters}
 *   categories={categories}
 * />
 * ```
 */
export function Filters({
  filters,
  onChange,
  categories,
  className,
  showClearButton = true,
}: FiltersProps) {
  const [localPriceRange, setLocalPriceRange] = React.useState({
    min: filters.priceRange?.min?.toString() || "",
    max: filters.priceRange?.max?.toString() || "",
  });

  // Update local state when filters change externally
  React.useEffect(() => {
    setLocalPriceRange({
      min: filters.priceRange?.min?.toString() || "",
      max: filters.priceRange?.max?.toString() || "",
    });
  }, [filters.priceRange?.min, filters.priceRange?.max]);

  const handlePriceChange = (
    type: "min" | "max",
    value: string
  ) => {
    setLocalPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const applyPriceRange = () => {
    const min = localPriceRange.min ? parseFloat(localPriceRange.min) : undefined;
    const max = localPriceRange.max ? parseFloat(localPriceRange.max) : undefined;

    onChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    onChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleRatingChange = (rating: number | undefined) => {
    onChange({
      ...filters,
      rating: rating,
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onChange({
      ...filters,
      inStock: checked || undefined,
    });
  };

  const clearAllFilters = () => {
    onChange({
      sortBy: filters.sortBy,
      search: filters.search,
    });
    setLocalPriceRange({ min: "", max: "" });
  };

  const hasActiveFilters =
    (filters.priceRange?.min !== undefined && filters.priceRange.min > 0) ||
    (filters.priceRange?.max !== undefined && filters.priceRange.max > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    filters.rating !== undefined ||
    filters.inStock === true;

  const activeFilterCount =
    (filters.priceRange?.min || filters.priceRange?.max ? 1 : 0) +
    (filters.categories?.length || 0) +
    (filters.rating ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const ratingOptions = [
    { value: 4, label: "4 & up" },
    { value: 3, label: "3 & up" },
    { value: 2, label: "2 & up" },
    { value: 1, label: "1 & up" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {showClearButton && hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
            onClick={clearAllFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["price", "categories", "rating"]} className="space-y-2">
        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localPriceRange.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    onBlur={applyPriceRange}
                    onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
                    className="pl-6"
                    min={0}
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localPriceRange.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    onBlur={applyPriceRange}
                    onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
                    className="pl-6"
                    min={0}
                  />
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={applyPriceRange}
                disabled={!localPriceRange.min && !localPriceRange.max}
              >
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <Separator />

        {/* Categories */}
        {categories.length > 0 && (
          <>
            <AccordionItem value="categories" className="border-none">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <CheckboxComp
                        id={`category-${category.id}`}
                        checked={filters.categories?.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                        {category.productCount !== undefined && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({category.productCount})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <Separator />
          </>
        )}

        {/* Rating */}
        <AccordionItem value="rating" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {ratingOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors",
                    filters.rating === option.value
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  )}
                  onClick={() =>
                    handleRatingChange(
                      filters.rating === option.value ? undefined : option.value
                    )
                  }
                >
                  <div className="flex items-center gap-0.5">
                    <StarRating rating={option.value} size="sm" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {option.label}
                  </span>
                  {filters.rating === option.value && (
                    <X className="ml-auto h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <Separator />

        {/* In Stock */}
        <div className="py-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="in-stock"
              className="cursor-pointer text-sm font-medium"
            >
              In Stock Only
            </Label>
            <CheckboxComp
              id="in-stock"
              checked={filters.inStock === true}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                handleInStockChange(checked === true)
              }
            />
          </div>
        </div>
      </Accordion>
    </div>
  );
}

export default Filters;
