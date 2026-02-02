"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFavoritesStore } from "@/features/favorites/store";
import { useCartStore } from "@/features/cart/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export function FavoritesClient() {
  const items = useFavoritesStore((s) => s.items);
  const removeItem = useFavoritesStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);
  const hydrated = useFavoritesStore((s) => s.hydrated);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "favorites-summary"],
    queryFn: () => getProducts({ pageSize: 100, page: 1 }),
  });

  const productsById = useMemo(() => {
    const map = new Map<string, Product>();
    (data?.items ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [data]);

  const favoriteProducts = useMemo(() => {
    return items
      .map((id) => productsById.get(id))
      .filter((p): p is Product => p !== undefined);
  }, [items, productsById]);

  if (!hydrated) {
    return (
       <div className="space-y-4">
         <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-40 animate-pulse bg-muted" />
            ))}
         </div>
       </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Save items you love to find them easily later."
        action={
          <Button asChild>
            <Link href={routes.products}>Browse products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Favorites ({items.length})</h1>
        <Button variant="outline" asChild>
          <Link href={routes.products}>Continue Shopping</Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <p className="col-span-full text-muted-foreground">Loading favorites...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                <ImageWithFallback
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Link
                      href={`${routes.products}/${product.slug}`}
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="font-medium">
                      {formatPrice(product.price.amount, product.price.currency)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        addToCart(product.id);
                        toast.success("Added to cart");
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
