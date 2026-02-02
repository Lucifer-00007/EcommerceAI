"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Search } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";

export function SavedItemsClient() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ecommerceai:favorites");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFavorites(new Set(parsed));
        }
      }
    } catch (e) {
      console.error("Failed to read favorites", e);
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => getProducts({ pageSize: 100 }),
  });

  const savedProducts = (data?.items ?? []).filter((p) => favorites.has(p.id));
  const filteredProducts = savedProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (favorites.size === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Saved Items</h2>
            <p className="text-sm text-muted-foreground">
              Products you&apos;ve saved for later.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Save items you love to revisit them later.
          </p>
          <Button asChild>
            <Link href={routes.products}>Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Saved Items</h2>
          <p className="text-sm text-muted-foreground">
            {savedProducts.length} {savedProducts.length === 1 ? "item" : "items"} saved for later.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved items..."
              className="h-9 w-[250px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} hrefBase={routes.products} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items found"
          description="Try adjusting your search query."
        />
      )}
    </div>
  );
}