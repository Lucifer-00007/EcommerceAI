"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories, getProducts, type ProductsQuery } from "@/features/products/api";
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

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const productsQuery = useMemo(
    () => ({
      q: debouncedQ || undefined,
      category,
      sort,
      page,
      minPrice,
      maxPrice,
      ratingMin,
      pageSize: 9,
    }),
    [category, debouncedQ, maxPrice, minPrice, page, ratingMin, sort],
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

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    const shouldResetPage = Object.keys(next).some((k) => k !== "page");
    if (shouldResetPage) {
      params.delete("page");
    }
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Filter, sort, and browse.</p>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="q">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="q"
              value={q}
              onChange={(e) => updateParams({ q: e.target.value })}
              placeholder="Search products…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category ?? "all"}
            onValueChange={(value) => updateParams({ category: value === "all" ? undefined : value })}
            disabled={categoriesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {(categories ?? []).map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sort</Label>
          <Select
            value={sort ?? "relevance"}
            onValueChange={(value) =>
              updateParams({ sort: value === "relevance" ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Relevance" />
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

        <div className="space-y-2">
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            type="number"
            inputMode="numeric"
            value={minPrice ?? ""}
            onChange={(e) => updateParams({ minPrice: e.target.value || undefined })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            type="number"
            inputMode="numeric"
            value={maxPrice ?? ""}
            onChange={(e) => updateParams({ maxPrice: e.target.value || undefined })}
            placeholder="250"
          />
        </div>

        <div className="space-y-2">
          <Label>Min rating</Label>
          <Select
            value={String(ratingMin ?? 0)}
            onValueChange={(value) => updateParams({ ratingMin: value === "0" ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2 md:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              startTransition(() => {
                router.replace(pathname);
              })
            }
          >
            Reset
          </Button>
        </div>
      </div>

      {productsLoading ? (
        <ProductGridSkeleton />
      ) : isError ? (
        <EmptyState title="Failed to load products" description={String((error as Error)?.message ?? "")} />
      ) : products && products.items.length ? (
        <div className="space-y-4">
          <ProductGrid products={products.items} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Page {products.page} of {products.totalPages} • {products.total} items
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={products.page <= 1}
                onClick={() => updateParams({ page: String(products.page - 1) })}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={products.page >= products.totalPages}
                onClick={() => updateParams({ page: String(products.page + 1) })}
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
  );
}
