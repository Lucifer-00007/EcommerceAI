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
  hideHeader,
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
  hideHeader?: boolean;
}) {
  const wrapperClassName =
    mode === "desktop"
      ? "hidden w-64 shrink-0 pr-4 lg:block"
      : "block w-full pr-0";
  const contentClassName =
    mode === "desktop"
      ? "sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-10 bg-card p-3 rounded-xl border shadow-sm"
      : "pb-10";
  return (
    <aside className={wrapperClassName}>
      <div className={contentClassName}>
        {!hideHeader && (
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filters</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-primary"
              onClick={onClear}
            >
              Clear all
            </Button>
          </div>
        )}

        <div className="border-b pb-6 pt-2">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Categories</h4>
          <div className="space-y-3">
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
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">{t}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{facets[t]}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-b py-6">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Price Range</h4>
          <div className="mb-6 px-1">
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
              className="py-4"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex w-full items-center">
              <span className="absolute left-3 text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                inputMode="numeric"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
                onBlur={() => onPriceCommit(priceRange)}
                className="h-9 w-full rounded-md border-border bg-background pl-6 text-sm shadow-sm focus-visible:ring-primary"
                aria-label="Min price"
              />
            </div>
            <span className="text-sm text-muted-foreground">-</span>
            <div className="relative flex w-full items-center">
              <span className="absolute left-3 text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                inputMode="numeric"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
                onBlur={() => onPriceCommit(priceRange)}
                className="h-9 w-full rounded-md border-border bg-background pl-6 text-sm shadow-sm focus-visible:ring-primary"
                aria-label="Max price"
              />
            </div>
          </div>
        </div>

        <div className="border-b py-6">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {clothSizes.map((size) => {
              const active = selectedSizes.has(size);
              return (
                <Button
                  key={size}
                  type="button"
                  variant={active ? "default" : "outline"}
                  className={`h-9 w-full rounded-md text-sm font-medium transition-all ${active ? "bg-primary text-primary-foreground shadow-md" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  onClick={() => {
                    const next = new Set(selectedSizes);
                    if (next.has(size)) next.delete(size);
                    else next.add(size);
                    setSelectedSizes(next);
                  }}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="py-6">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Color</h4>
          <div className="flex flex-wrap gap-3">
            {clothColors.map((c) => {
              const active = selectedColors.has(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:scale-110 ${active ? "ring-2 ring-primary ring-offset-2" : "border-transparent ring-1 ring-border"
                    }`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => {
                    const next = new Set(selectedColors);
                    if (next.has(c.key)) next.delete(c.key);
                    else next.add(c.key);
                    setSelectedColors(next);
                  }}
                  title={c.name}
                  aria-label={`Select ${c.name}`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-white shadow-sm" />}
                </button>
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
      <nav className="mb-8 flex items-center text-sm text-muted-foreground">
        <Link href={routes.home} className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span className="font-medium text-foreground">Clothes</span>
      </nav>

      <div className="">
        <div className="text-center mb-12 mb-8">
          <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
            Find your desire
          </div>
          <h1 className="pt-2 text-6xl font-bold tracking-tight text-foreground">Search Clothes</h1>
          <p className="pt-2 text-muted-foreground">
            Showing {products?.total ?? 0} products
          </p>
        </div>

        <div className="flex items-center gap-4 lg:gap-12">
          {/* Filters Component (Left) */}
          <div className="shrink-0 lg:w-64">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline" size="default" className="gap-2">
                    <Filter className="h-4 w-4" />
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

            {/* Desktop Header */}
            <div className="hidden items-center justify-between lg:flex">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-auto py-1 text-xs font-medium text-muted-foreground hover:text-primary"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          </div>

          {/* Search Input (Right) */}
          <div className="flex flex-1 items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                id="q"
                value={q}
                onChange={(e) => updateParams({ q: e.target.value })}
                placeholder="Search clothing..."
                className="h-12 w-full max-w-lg rounded-2xl border-border bg-background pl-6 shadow-sm focus-visible:ring-primary"
              />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <Select
                value={sort ?? "relevance"}
                onValueChange={(value) => updateParams({ sort: value === "relevance" ? undefined : value })}
              >
                <SelectTrigger className="h-12 w-[180px] rounded-lg border-border bg-background px-3 text-foreground hover:bg-accent/50 focus:ring-primary">
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
          </div>
        </div>
      </div>

      <div className="flex items-start gap-12">
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
          hideHeader={true}
        />

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : isError ? (
            <EmptyState title="Failed to load clothes" description={String((error as Error)?.message ?? "")} />
          ) : filteredItems.length ? (
            <div className="space-y-12">
              <ProductGrid products={filteredItems} hrefBase={routes.clothes} />
              {products ? (
                <div className="flex items-center justify-between border-t pt-8">
                  <p className="text-sm text-muted-foreground">
                    Page {products.page} of {products.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
                      disabled={products.page <= 1}
                      onClick={() => updateParams({ page: String(Math.max(1, products.page - 1)) })}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
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
