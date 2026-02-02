"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, ArrowRight, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const { data, isLoading, isError, error, refetch } = useQuery({
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
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load orders"
        description={String((error as Error)?.message ?? "Something went wrong. Please try again.")}
        action={
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => refetch()}>Retry</Button>
             <Button asChild variant="default">
               <Link href={routes.products}>Shop products</Link>
             </Button>
          </div>
        }
      />
    );
  }

  const orders = data?.orders ?? [];
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="h-9 w-[200px] lg:w-[250px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild variant="outline" size="sm" className="h-9 hidden sm:flex">
            <Link href={routes.products}>
              Shop <ArrowRight className="ml-2 h-4 w-4" />
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
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer focus:bg-muted/50 focus:outline-none"
                      onClick={() => router.push(`${routes.accountOrders}/${order.id}`)}
                      role="row"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`${routes.accountOrders}/${order.id}`);
                        }
                      }}
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
                                <span className="mr-1">{item.quantity}x</span>
                                <Link
                                  href={`${routes.products}/${product?.slug ?? item.productId}`}
                                  className="hover:underline hover:text-primary"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {product?.name ?? item.productId}
                                </Link>
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
                      No orders found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end space-x-2 p-4 border-t">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

