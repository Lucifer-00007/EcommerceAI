"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { ProductFilters } from "@/components/product/product-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts, type ProductsQuery } from "@/features/products/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

function toNumber(value: string | null) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

type Sort = NonNullable<ProductsQuery["sort"]>;

function toSort(value: string | null): Sort | undefined {
  switch (value) {
    case "relevance":
    case "newest":
    case "price_asc":
    case "price_desc":
    case "rating_desc":
      return value;
    default:
      return undefined;
  }
}

export function ProductsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const q = (searchParams.get("q") ?? "").trim();
  const debouncedQ = useDebouncedValue(q, 250);

  const category = (searchParams.get("category") ?? "").trim() || undefined;
  const sort = toSort(searchParams.get("sort"));
  const page = Math.max(1, Math.floor(toNumber(searchParams.get("page")) ?? 1));

  const minPrice = toNumber(searchParams.get("minPrice"));
  const maxPrice = toNumber(searchParams.get("maxPrice"));
  const ratingMin = toNumber(searchParams.get("ratingMin"));
  const colors = searchParams.get("colors")?.split(",").filter(Boolean);
  const sizes = searchParams.get("sizes")?.split(",").filter(Boolean);

  const productsQuery = useMemo(
    () => ({
      q: debouncedQ || undefined,
      category,
      sort,
      page,
      minPrice,
      maxPrice,
      ratingMin,
      colors,
      sizes,
      pageSize: 9,
    }),
    [category, colors, debouncedQ, maxPrice, minPrice, page, ratingMin, sizes, sort],
  );

  const {
    data: products,
    isLoading: productsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", productsQuery],
    queryFn: () => getProducts(productsQuery),
  });

  function updateParams(next: Record<string, string | number | string[] | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(","));
        else params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    // Reset page when filters change (except when page itself changes)
    const shouldResetPage = Object.keys(next).some((k) => k !== "page");
    if (shouldResetPage) {
      params.delete("page");
    }
    
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search results.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-8">
              <ProductFilters
                filters={productsQuery}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onFilterChange={(f) => updateParams(f as any)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20">
          <ProductFilters
            filters={productsQuery}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onFilterChange={(f) => updateParams(f as any)}
          />
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <div className="flex items-center gap-2">
            <Select
              value={sort ?? "relevance"}
              onValueChange={(value) =>
                updateParams({ sort: value === "relevance" ? undefined : value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <EmptyState title="Failed to load products" description={String((error as Error)?.message ?? "")} />
        ) : products && products.items.length ? (
          <div className="space-y-8">
            <ProductGrid products={products.items} />
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Page {products.page} of {products.totalPages} • {products.total} items
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={products.page <= 1}
                  onClick={() => updateParams({ page: products.page - 1 })}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={products.page >= products.totalPages}
                  onClick={() => updateParams({ page: products.page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="No products found" description="Try changing filters or searching for something else." />
        )}
      </div>
    </div>
  );
}
