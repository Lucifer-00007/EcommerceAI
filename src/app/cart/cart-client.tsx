"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export function CartClient() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "cart-summary"],
    queryFn: () => getProducts({ pageSize: 48, page: 1 }),
  });

  const productsById = useMemo(() => {
    const map = new Map<string, Product>();
    (data?.items ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [data]);

  const lines = useMemo(() => {
    return items
      .map((line) => ({
        line,
        product: productsById.get(line.productId) ?? null,
      }))
      .filter((x) => x.product !== null);
  }, [items, productsById]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, { line, product }) => {
      if (!product) return sum;
      return sum + product.price.amount * line.quantity;
    }, 0);
    return { subtotal, currency: lines[0]?.product?.price.currency ?? "USD" };
  }, [lines]);

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse products and add something you love."
        action={
          <Button asChild>
            <Link href={routes.products}>Shop products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Loading cart…</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {lines.map(({ line, product }) => {
              if (!product) return null;
              return (
                <Card key={line.productId}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`${routes.products}/${product.slug}`}
                          className="font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(product.price.amount, product.price.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          disabled={line.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          className="w-16 text-center"
                          inputMode="numeric"
                          value={String(line.quantity)}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            if (!Number.isFinite(n)) return;
                            setQuantity(line.productId, n);
                          }}
                          aria-label="Quantity"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(line.productId)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-6">
          <p className="text-lg font-medium">Order summary</p>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(totals.subtotal, totals.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <Separator />
          <Button asChild className="w-full" disabled={!lines.length}>
            <Link href={routes.checkout}>Checkout</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href={routes.products}>Continue shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
