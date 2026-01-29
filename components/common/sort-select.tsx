/**
 * Sort Select Component
 *
 * Dropdown for selecting product sort order with predefined options.
 * Uses shadcn Select component for accessibility.
 *
 * @module components/common
 */

"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Star, Sparkles, Calendar, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/types";

export interface SortSelectProps {
  /** Current sort value */
  value: SortOption;
  /** Callback when sort changes */
  onChange: (value: SortOption) => void;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
}

interface SortOptionConfig {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOptionConfig[] = [
  {
    value: "featured",
    label: "Featured",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    icon: <ArrowUp className="h-4 w-4" />,
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    icon: <ArrowDown className="h-4 w-4" />,
  },
  {
    value: "rating",
    label: "Highest Rated",
    icon: <Star className="h-4 w-4" />,
  },
  {
    value: "newest",
    label: "Newest First",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    value: "name-asc",
    label: "Name: A to Z",
    icon: <ArrowUp className="h-4 w-4" />,
  },
  {
    value: "name-desc",
    label: "Name: Z to A",
    icon: <ArrowDown className="h-4 w-4" />,
  },
  {
    value: "bestselling",
    label: "Best Selling",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
];

/**
 * Sort select dropdown for product listings
 *
 * @example
 * ```tsx
 * <SortSelect
 *   value={sortBy}
 *   onChange={(value) => setSortBy(value)}
 * />
 * ```
 */
export function SortSelect({
  value,
  onChange,
  className,
  placeholder = "Sort by",
}: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("w-[180px] gap-2", className)}
        aria-label="Sort products"
      >
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="gap-2"
          >
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SortSelect;
