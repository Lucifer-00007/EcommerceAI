"use client";

import { useMemo, useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCategories, type ProductsQuery } from "@/features/products/api";
import { clothColors, clothSizes } from "@/features/clothes/utils";
import { cn } from "@/lib/utils";

type ProductFiltersProps = {
  filters: ProductsQuery;
  onFilterChange: (filters: ProductsQuery) => void;
  className?: string;
};

export function ProductFilters({ filters, onFilterChange, className }: ProductFiltersProps) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // Local state for price slider to avoid excessive updates
  const [priceRange, setPriceRange] = useState([filters.minPrice ?? 0, filters.maxPrice ?? 250]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPriceRange([filters.minPrice ?? 0, filters.maxPrice ?? 250]);
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value: number[]) => {
    onFilterChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.category) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.ratingMin) count++;
    if (filters.colors?.length) count++;
    if (filters.sizes?.length) count++;
    return count;
  }, [filters]);

  const clearAll = () => {
    onFilterChange({
      sort: filters.sort,
      pageSize: filters.pageSize,
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-auto px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all ({activeCount})
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search products..."
            value={filters.q ?? ""}
            onChange={(e) => onFilterChange({ ...filters, q: e.target.value || undefined })}
          />
        </div>

        <Accordion type="multiple" defaultValue={["category", "price", "color", "size"]} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                <Button
                  variant={!filters.category ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onFilterChange({ ...filters, category: undefined })}
                >
                  All Categories
                </Button>
                {categories?.map((c) => (
                  <Button
                    key={c.id}
                    variant={filters.category === c.slug ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onFilterChange({ ...filters, category: c.slug })}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Slider
                  defaultValue={[0, 250]}
                  value={priceRange}
                  min={0}
                  max={250}
                  step={5}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceCommit}
                />
                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPriceRange([val, priceRange[1]]);
                      }}
                      onBlur={() => handlePriceCommit(priceRange)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPriceRange([priceRange[0], val]);
                      }}
                      onBlur={() => handlePriceCommit(priceRange)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="color">
            <AccordionTrigger className="text-sm font-medium">Color</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {clothColors.map((c) => {
                  const isActive = filters.colors?.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      type="button"
                      className={cn(
                        "relative h-8 w-8 rounded-full border border-border shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isActive && "ring-2 ring-primary ring-offset-2"
                      )}
                      style={{ backgroundColor: c.value }}
                      onClick={() => {
                        const next = isActive
                          ? filters.colors?.filter((x) => x !== c.key)
                          : [...(filters.colors ?? []), c.key];
                        onFilterChange({ ...filters, colors: next?.length ? next : undefined });
                      }}
                      title={c.name}
                    >
                      {isActive && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="size">
            <AccordionTrigger className="text-sm font-medium">Size</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-2 pt-2">
                {clothSizes.map((s) => {
                  const isActive = filters.sizes?.includes(s);
                  return (
                    <Button
                      key={s}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="h-9 w-full"
                      onClick={() => {
                        const next = isActive
                          ? filters.sizes?.filter((x) => x !== s)
                          : [...(filters.sizes ?? []), s];
                        onFilterChange({ ...filters, sizes: next?.length ? next : undefined });
                      }}
                    >
                      {s}
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          
           <AccordionItem value="rating">
            <AccordionTrigger className="text-sm font-medium">Rating</AccordionTrigger>
            <AccordionContent>
               <div className="space-y-1">
                 {[4, 3, 2, 1].map((r) => (
                   <Button
                     key={r}
                     variant="ghost"
                     size="sm"
                     className={cn("w-full justify-start gap-2", filters.ratingMin === r && "bg-secondary")}
                     onClick={() => onFilterChange({ ...filters, ratingMin: filters.ratingMin === r ? undefined : r })}
                   >
                     <div className="flex text-yellow-400">
                       {Array.from({ length: 5 }).map((_, i) => (
                         <svg
                           key={i}
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 24 24"
                           fill={i < r ? "currentColor" : "none"}
                           stroke="currentColor"
                           className="h-4 w-4"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                         </svg>
                       ))}
                     </div>
                     <span className="text-xs text-muted-foreground">& Up</span>
                   </Button>
                 ))}
               </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
