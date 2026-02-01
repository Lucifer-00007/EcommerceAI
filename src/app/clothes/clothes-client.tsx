"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { routes } from "@/lib/routes";
import { getProducts, type ProductsQuery } from "@/features/products/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  buildClothesFacets,
  clothColors,
  clothSizes,
  clothTypes,
  type ClothColor,
  type ClothSize,
  type ClothType,
  deriveClothType,
  getAvailableColors,
  getAvailableSizes,
} from "@/features/clothes/utils";

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

function parseCsv<T extends string>(value: string | null): Set<T> {
  if (!value) return new Set<T>();
  return new Set(value.split(",").map((v) => v.trim()).filter(Boolean) as T[]);
}

function formatCsv(value: Set<string>) {
  return Array.from(value).join(",");
}

function FilterSidebar({
  facets,
  selectedTypes,
  setSelectedTypes,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  priceRange,
  setPriceRange,
  onPriceCommit,
  onClear,
  mode,
}: {
  facets: Record<ClothType, number>;
  selectedTypes: Set<ClothType>;
  setSelectedTypes: (next: Set<ClothType>) => void;
  selectedSizes: Set<ClothSize>;
  setSelectedSizes: (next: Set<ClothSize>) => void;
  selectedColors: Set<ClothColor["key"]>;
  setSelectedColors: (next: Set<ClothColor["key"]>) => void;
  priceRange: [number, number];
  setPriceRange: (next: [number, number]) => void;
  onPriceCommit: (next: [number, number]) => void;
  onClear: () => void;
  mode: "desktop" | "mobile";
}) {
  const wrapperClassName =
    mode === "desktop"
      ? "hidden w-64 shrink-0 pr-4 lg:block"
      : "block w-full pr-0";
  const contentClassName =
    mode === "desktop"
      ? "sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-10"
      : "pb-10";
  return (
    <aside className={wrapperClassName}>
      <div className={contentClassName}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Filters</h3>
          <button
            type="button"
            className="rounded-md border border-[color:var(--control-border)] bg-card px-2 py-1 text-xs font-semibold text-primary shadow-sm hover:border-[color:var(--control-border-hover)] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={onClear}
          >
            Clear all
          </button>
        </div>

        <div className="border-b py-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">Categories</h4>
          <div className="space-y-2">
            {clothTypes.map((t) => {
              const checked = selectedTypes.has(t);
              return (
                <label key={t} className="group flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      const next = new Set(selectedTypes);
                      if (v) next.add(t);
                      else next.delete(t);
                      setSelectedTypes(next);
                    }}
                    aria-label={`Filter ${t}`}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">{t}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{facets[t]}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-b py-4">
          <h4 className="mb-4 text-sm font-medium text-foreground">Price Range</h4>
          <div className="mb-4 px-1">
            <Slider
              value={[priceRange[0], priceRange[1]]}
              min={0}
              max={250}
              step={5}
              onValueChange={(v) => setPriceRange([v[0] ?? 0, v[1] ?? 0])}
              onValueCommit={(v) => {
                const next: [number, number] = [v[0] ?? 0, v[1] ?? 0];
                setPriceRange(next);
                onPriceCommit(next);
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex w-full items-center rounded bg-card px-2 py-1 ring-1 ring-inset ring-border">
              <span className="text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                inputMode="numeric"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
                onBlur={() => onPriceCommit(priceRange)}
                className="h-7 w-full border-0 bg-transparent p-0 text-right text-sm font-medium text-foreground shadow-none focus-visible:ring-0"
                aria-label="Min price"
              />
            </div>
            <span className="text-sm text-muted-foreground">-</span>
            <div className="flex w-full items-center rounded bg-card px-2 py-1 ring-1 ring-inset ring-border">
              <span className="text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                inputMode="numeric"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
                onBlur={() => onPriceCommit(priceRange)}
                className="h-7 w-full border-0 bg-transparent p-0 text-right text-sm font-medium text-foreground shadow-none focus-visible:ring-0"
                aria-label="Max price"
              />
            </div>
          </div>
        </div>

        <div className="border-b py-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {clothSizes.map((size) => {
              const active = selectedSizes.has(size);
              return (
                <Button
                  key={size}
                  type="button"
                  variant={active ? "default" : "outline"}
                  className="h-9 w-full rounded border-border text-sm font-medium"
                  onClick={() => {
                    const next = new Set(selectedSizes);
                    if (next.has(size)) next.delete(size);
                    else next.add(size);
                    setSelectedSizes(next);
                  }}
                  aria-pressed={active}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="py-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">Color</h4>
          <div className="flex gap-3">
            {clothColors.map((c) => {
              const active = selectedColors.has(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-label={`Select ${c.name}`}
                  className="h-10 w-10 rounded-full ring-offset-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: c.value,
                    boxShadow: active ? "0 0 0 2px var(--color-primary)" : undefined,
                  }}
                  onClick={() => {
                    const next = new Set(selectedColors);
                    if (next.has(c.key)) next.delete(c.key);
                    else next.add(c.key);
                    setSelectedColors(next);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ClothesClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const q = (searchParams.get("q") ?? "").trim();
  const debouncedQ = useDebouncedValue(q, 250);

  const sort = toSort(searchParams.get("sort"));
  const page = Math.max(1, Math.floor(toNumber(searchParams.get("page")) ?? 1));

  const minPrice = toNumber(searchParams.get("minPrice")) ?? 0;
  const maxPrice = toNumber(searchParams.get("maxPrice")) ?? 250;

  const selectedTypes = parseCsv<ClothType>(searchParams.get("types"));
  const selectedSizes = parseCsv<ClothSize>(searchParams.get("sizes"));
  const selectedColors = parseCsv<ClothColor["key"]>(searchParams.get("colors"));

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const updateParams = useCallback((next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    const shouldResetPage = Object.keys(next).some((k) => k !== "page");
    if (shouldResetPage) params.delete("page");
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }, [pathname, router, searchParams, startTransition]);

  const productsQuery = useMemo(
    () => ({
      q: debouncedQ || undefined,
      category: "apparel",
      sort,
      page,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 250 ? priceRange[1] : undefined,
      pageSize: 12,
    }),
    [debouncedQ, page, priceRange, sort],
  );

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clothes", productsQuery],
    queryFn: () => getProducts(productsQuery),
  });

  const filteredItems = useMemo(() => {
    const items = products?.items ?? [];
    return items.filter((p) => {
      if (selectedTypes.size > 0) {
        const type = deriveClothType(p);
        if (!selectedTypes.has(type)) return false;
      }
      if (selectedSizes.size > 0) {
        const available = getAvailableSizes(p);
        const matches = Array.from(selectedSizes).some((s) => available.has(s));
        if (!matches) return false;
      }
      if (selectedColors.size > 0) {
        const available = getAvailableColors(p);
        const matches = Array.from(selectedColors).some((c) => available.has(c));
        if (!matches) return false;
      }
      return true;
    });
  }, [products?.items, selectedColors, selectedSizes, selectedTypes]);

  const facets = useMemo(() => buildClothesFacets(products?.items ?? []), [products?.items]);

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    ["q", "sort", "page", "minPrice", "maxPrice", "types", "sizes", "colors"].forEach((k) =>
      params.delete(k),
    );
    setPriceRange([0, 250]);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }
  const onPriceCommit = useCallback(
    (next: [number, number]) => {
      updateParams({
        minPrice: next[0] > 0 ? String(next[0]) : undefined,
        maxPrice: next[1] < 250 ? String(next[1]) : undefined,
      });
    },
    [updateParams],
  );

  return (
    <div className="w-full">
      <nav className="mb-6 flex items-center text-sm text-muted-foreground">
        <Link href={routes.home} className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span className="font-medium text-foreground">Clothes</span>
      </nav>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clothes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {products?.total ?? 0} products
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:flex">
            <span>Sort by:</span>
            <Select
              value={sort ?? "relevance"}
              onValueChange={(value) => updateParams({ sort: value === "relevance" ? undefined : value })}
            >
              <SelectTrigger className="h-9 w-[180px] rounded-lg border border-[color:var(--control-border)] bg-card/60 px-3 font-semibold text-foreground shadow-none hover:border-[color:var(--control-border-hover)] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" className="rounded-lg bg-card lg:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[360px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar
                  facets={facets}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={(next) => updateParams({ types: formatCsv(next) || undefined })}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={(next) => updateParams({ sizes: formatCsv(next) || undefined })}
                  selectedColors={selectedColors}
                  setSelectedColors={(next) => updateParams({ colors: formatCsv(next) || undefined })}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  onPriceCommit={onPriceCommit}
                  onClear={clearAll}
                mode="mobile"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex items-start gap-10">
        <FilterSidebar
          facets={facets}
          selectedTypes={selectedTypes}
          setSelectedTypes={(next) => updateParams({ types: formatCsv(next) || undefined })}
          selectedSizes={selectedSizes}
          setSelectedSizes={(next) => updateParams({ sizes: formatCsv(next) || undefined })}
          selectedColors={selectedColors}
          setSelectedColors={(next) => updateParams({ colors: formatCsv(next) || undefined })}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onPriceCommit={onPriceCommit}
          onClear={clearAll}
          mode="desktop"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Input
                id="q"
                value={q}
                onChange={(e) => updateParams({ q: e.target.value })}
                placeholder="Search clothing…"
                className="h-10 rounded-lg border-0 bg-card shadow-sm ring-1 ring-inset ring-border focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : isError ? (
            <EmptyState title="Failed to load clothes" description={String((error as Error)?.message ?? "")} />
          ) : filteredItems.length ? (
            <div className="space-y-8">
              <ProductGrid products={filteredItems} hrefBase={routes.clothes} />
              {products ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Page {products.page} of {products.totalPages} • {products.total} items
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg bg-card"
                      disabled={products.page <= 1}
                      onClick={() => updateParams({ page: String(Math.max(1, products.page - 1)) })}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg bg-card"
                      disabled={products.page >= products.totalPages}
                      onClick={() => updateParams({ page: String(products.page + 1) })}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState title="No clothing found" description="Try adjusting your filters." />
          )}
        </div>
      </div>
    </div>
  );
}
