import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, Search, Package } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Products() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);

  const [category, setCategory] = useState(params.get("category") || "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [sort, setSort] = useState(params.get("sort") || "");
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const queryParams = new URLSearchParams();
  if (category) queryParams.set("category", category);
  if (minPrice) queryParams.set("minPrice", minPrice);
  if (maxPrice) queryParams.set("maxPrice", maxPrice);
  if (sort) queryParams.set("sort", sort);
  if (searchQuery) queryParams.set("search", searchQuery);
  queryParams.set("page", page.toString());
  queryParams.set("pageSize", "12");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/products", queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryParams.toString()}`);
      return res.json();
    },
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (category) newParams.set("category", category);
    if (minPrice) newParams.set("minPrice", minPrice);
    if (maxPrice) newParams.set("maxPrice", maxPrice);
    if (sort) newParams.set("sort", sort);
    if (searchQuery) newParams.set("search", searchQuery);
    if (page > 1) newParams.set("page", page.toString());
    
    const newSearch = newParams.toString();
    setLocation(`/products${newSearch ? `?${newSearch}` : ""}`, { replace: true });
  }, [category, minPrice, maxPrice, sort, searchQuery, page, setLocation]);

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setMinPrice(value[0].toString());
    setMaxPrice(value[1].toString());
    setPage(1);
  };

  const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setSearchQuery("");
    setPriceRange([0, 2000]);
    setPage(1);
  };

  const hasFilters = category || minPrice || maxPrice || sort || searchQuery;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          {(categories as any[])?.map((cat: any) => (
            <div key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={cat.slug}
                checked={category === cat.name}
                onCheckedChange={(checked) => {
                  setCategory(checked ? cat.name : "");
                  setPage(1);
                }}
                data-testid={`checkbox-category-${cat.slug}`}
              />
              <label htmlFor={cat.slug} className="text-sm cursor-pointer flex-1">
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-4 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          max={2000}
          step={10}
          className="mb-4"
          data-testid="slider-price-range"
        />
        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary">${priceRange[0]}</Badge>
          <span className="text-muted-foreground">to</span>
          <Badge variant="secondary">${priceRange[1]}</Badge>
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters} data-testid="button-clear-filters">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <Card className="sticky top-24 border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Filters
              </h2>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              {data && (
                <p className="text-muted-foreground mt-1">
                  Showing {data.items?.length || 0} of {data.total || 0} products
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="icon" className="shrink-0" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="relative flex-1 sm:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                  data-testid="input-product-search"
                />
              </div>

              <Select
                value={sort}
                onValueChange={(value) => {
                  setSort(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating_desc">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : data?.items?.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-20 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.items?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-full"
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      let pageNum;
                      if (data.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= data.totalPages - 2) {
                        pageNum = data.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "ghost"}
                          size="icon"
                          className={`rounded-full ${page === pageNum ? "bg-gradient-to-r from-primary to-purple-600 border-0" : ""}`}
                          onClick={() => setPage(pageNum)}
                          data-testid={`button-page-${pageNum}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-full"
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
