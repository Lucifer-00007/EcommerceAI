"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/features/account/api";
import { useAuthStore } from "@/features/auth/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { OrderStatus, Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

function statusVariant(status: OrderStatus): "default" | "secondary" | "destructive" {
  switch (status) {
    case "fulfilled":
      return "default";
    case "paid":
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
  }
}

export function OrdersClient() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  const { data: productsData } = useQuery({
    queryKey: ["products", "orders-summary"],
    queryFn: () => getProducts({ pageSize: 48, page: 1 }),
    enabled: Boolean(user),
  });

  const productsById = useMemo(() => {
    const map = new Map<string, Product>();
    (productsData?.items ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [productsData]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["account", "orders"],
    queryFn: () => getOrders(),
    enabled: Boolean(user),
  });

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in required"
        description="Login to view your orders."
        action={
          <Button asChild>
            <Link href={routes.login}>Login</Link>
          </Button>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load orders"
        description={String((error as Error)?.message ?? "")}
        action={
          <Button asChild variant="secondary">
            <Link href={routes.products}>Shop products</Link>
          </Button>
        }
      />
    );
  }

  const orders = data?.orders ?? [];

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Place an order to see it here."
        action={
          <Button asChild>
            <Link href={routes.products}>Shop products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-3 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium">Order {order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              {order.items.map((item) => {
                const product = productsById.get(item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between gap-3">
                    <span className="line-clamp-1">
                      {product?.name ?? item.productId} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.unitPrice.amount * item.quantity, item.unitPrice.currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">
                {formatPrice(order.total.amount, order.total.currency)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

