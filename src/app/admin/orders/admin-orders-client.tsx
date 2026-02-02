"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { getAdminOrders } from "@/features/admin/api";
import { useAuthStore } from "@/features/auth/store";
import { routes } from "@/lib/routes";
import type { OrderStatus } from "@/types/ecommerce";
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

export function AdminOrdersClient() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getAdminOrders,
    enabled: Boolean(user),
  });

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="p-6">
           <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
       <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
            <p className="text-sm text-muted-foreground">Manage your recent purchases and track shipments.</p>
          </div>
          <EmptyState
            title="Unauthorized"
            description="You must be logged in to view admin orders."
            action={
              <Button asChild>
                <Link href={routes.login}>Login</Link>
              </Button>
            }
          />
       </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <Card>
          <CardHeader className="px-6 py-4 border-b">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">Manage your recent purchases and track shipments.</p>
        </div>
        <EmptyState
          title="Failed to load orders"
          description={String((error as Error)?.message ?? "Something went wrong. Please try again.")}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
        <p className="text-sm text-muted-foreground">Manage your recent purchases and track shipments.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Total</th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Customer</th>
                  <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-24 text-center">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      role="row"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/admin/orders/${order.id}`);
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
                      <td className="p-6 align-middle font-medium">
                        {formatPrice(order.total.amount, order.total.currency)}
                      </td>
                      <td className="p-6 align-middle text-muted-foreground">
                        {order.shippingAddress.fullName}
                      </td>
                      <td className="p-6 align-middle text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/orders/${order.id}`);
                          }}
                        >
                          <span className="sr-only">View details</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
