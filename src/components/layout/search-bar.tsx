/**
 * Search Bar Component
 *
 * Search input with expandable functionality and dropdown results.
 * Uses useSearchProducts hook for product search.
 *
 * @module components/layout
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchProducts } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";

export interface SearchBarProps {
  /** Whether the search bar is expanded (mobile) */
  isExpanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Whether to auto focus the input */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Search bar with dropdown results
 *
 * Features:
 * - Debounced search input
 * - Dropdown with product suggestions
 * - Keyboard navigation support
 * - Clear button
 * - Navigate to search results on Enter
 */
export function SearchBar({
  isExpanded = false,
  onExpandedChange,
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 300);

  // Fetch search results
  const { data: results, isLoading } = useSearchProducts(debouncedQuery, {
    enabled: debouncedQuery.length >= 2,
  });

  // Auto focus on mount if requested
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when results change
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      onExpandedChange?.(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    onExpandedChange?.(false);
    router.push(`/products/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !results) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleResultClick(results[highlightedIndex].slug);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const showResults = isOpen && debouncedQuery.length >= 2;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className={cn(
            "pl-10 pr-10 w-full",
            isExpanded && "animate-in fade-in zoom-in-95 duration-200"
          )}
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={showResults ? "search-results" : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `search-result-${highlightedIndex}` : undefined
          }
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover rounded-md border shadow-lg overflow-hidden"
          role="listbox"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : results && results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {/* Results */}
              <div className="py-2">
                {results.slice(0, 5).map((product, index) => (
                  <button
                    key={product.id}
                    id={`search-result-${index}`}
                    onClick={() => handleResultClick(product.slug)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      index === highlightedIndex
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    )}
                    role="option"
                    aria-selected={index === highlightedIndex}
                  >
                    {/* Product Image */}
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* View All Results */}
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => {
                    setIsOpen(false);
                    onExpandedChange?.(false);
                    router.push(`/products?q=${encodeURIComponent(query)}`);
                  }}
                >
                  <span>View all results</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
