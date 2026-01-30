'use client';

// Product filters component
// Filters for sorting and filtering products

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { ProductCategory } from '@/types/product.types';

/**
 * Product filters component props
 */
export interface ProductFiltersProps {
  /** Currently selected categories */
  selectedCategories: ProductCategory[];
  /** Callback when categories change */
  onCategoriesChange: (categories: ProductCategory[]) => void;
  /** Current price range [min, max] */
  priceRange: [number, number];
  /** Callback when price range changes */
  onPriceRangeChange: (range: [number, number]) => void;
  /** Current minimum rating */
  minRating: number;
  /** Callback when minimum rating changes */
  onMinRatingChange: (rating: number) => void;
  /** Available categories */
  availableCategories: ProductCategory[];
  /** Maximum price value */
  maxPrice: number;
  /** Whether filters are on mobile (collapsible) */
  isMobile?: boolean;
  /** Callback to clear all filters */
  onClearFilters: () => void;
  /** Callback to apply filters */
  onApplyFilters: () => void;
}

/**
 * Collapsible filter section component
 */
interface CollapsibleSectionProps {
  /** Section title */
  title: string;
  /** Whether section is expanded */
  isExpanded: boolean;
  /** Callback to toggle expansion */
  onToggle: () => void;
  /** Section content */
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="border-b border-border pb-4 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left font-semibold transition-colors hover:text-primary"
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isExpanded && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

/**
 * Product filters component
 * Provides category, price range, and rating filters for products
 */
export default function ProductFilters({
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  availableCategories,
  maxPrice,
  isMobile = false,
  onClearFilters,
  onApplyFilters,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    priceRange: true,
    rating: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: ProductCategory, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...selectedCategories, category]);
    } else {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    }
  };

  const handlePriceRangeChange = (values: number[]) => {
    onPriceRangeChange([values[0], values[1]]);
  };

  const handleRatingClick = (rating: number) => {
    onMinRatingChange(rating === minRating ? 0 : rating);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    minRating > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto p-0 text-sm text-muted-foreground hover:text-destructive"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category, false)}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
            >
              {category}
              <X className="h-3 w-3" />
            </button>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <button
              type="button"
              onClick={() => onPriceRangeChange([0, maxPrice])}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
            >
              ${priceRange[0]} - ${priceRange[1]}
              <X className="h-3 w-3" />
            </button>
          )}
          {minRating > 0 && (
            <button
              type="button"
              onClick={() => onMinRatingChange(0)}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
            >
              {minRating}+ Stars
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Category Filter */}
      <CollapsibleSection
        title="Categories"
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-sm font-normal"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Price Range Filter */}
      <CollapsibleSection
        title="Price Range"
        isExpanded={expandedSections.priceRange}
        onToggle={() => toggleSection('priceRange')}
      >
        <div className="space-y-4">
          <Slider
            min={0}
            max={maxPrice}
            step={10}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">${priceRange[0]}</span>
            <span className="font-medium">${priceRange[1]}</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Rating Filter */}
      <CollapsibleSection
        title="Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className={`flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors ${
                minRating === rating
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? minRating === rating
                          ? 'fill-current'
                          : 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2">{rating} & Up</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Apply Filters Button (Mobile) */}
      {isMobile && (
        <div className="pt-4">
          <Button onClick={onApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
