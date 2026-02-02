"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Package, ArrowRight, Search } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getOrders } from "@/features/account/api";
import { useAuthStore } from "@/features/auth/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { OrderStatus, Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

function statusVariant(status: OrderStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "fulfilled":
      return "default";
    case "paid":
      return "secondary";
    case "pending":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

export function OrdersClient() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");

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
          <p className="text-sm text-muted-foreground">Loading...</p>
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
          <p className="text-sm text-muted-foreground">Loading orders...</p>
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
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!orders.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
            <p className="text-sm text-muted-foreground">
              Track your recent purchases.
            </p>
          </div>
        </div>
        <EmptyState
          title="No orders yet"
          description="Place an order to see it here."
          action={
            <Button asChild>
              <Link href={routes.products}>Start Shopping</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            View and track your order history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="h-9 w-[250px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href={routes.products}>
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-base font-medium">Order History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Items</th>
                  <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Total</th>
                  <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-6 align-middle font-medium">#{order.id}</td>
                      <td className="p-6 align-middle text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-6 align-middle">
                        <Badge variant={statusVariant(order.status)} className="capitalize">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-6 align-middle text-muted-foreground max-w-[300px]">
                        <div className="flex flex-col gap-1">
                          {order.items.slice(0, 2).map((item) => {
                            const product = productsById.get(item.productId);
                            return (
                              <div key={item.productId} className="truncate">
                                {item.quantity}x {product?.name ?? item.productId}
                              </div>
                            );
                          })}
                          {order.items.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{order.items.length - 2} more items
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 align-middle text-right font-medium">
                        {formatPrice(order.total.amount, order.total.currency)}
                      </td>
                      <td className="p-6 align-middle text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">View details</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No orders found matching &quot;{searchQuery}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

