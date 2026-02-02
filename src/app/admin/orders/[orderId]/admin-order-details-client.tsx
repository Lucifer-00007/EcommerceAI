"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MoreVertical,
  Clock
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAdminOrder } from "@/features/admin/api";
import { useAuthStore } from "@/features/auth/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { OrderStatus, Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

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

export function AdminOrderDetailsClient() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "";
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  const { data: productsData } = useQuery({
    queryKey: ["products", "admin-order-details"],
    queryFn: () => getProducts({ pageSize: 100, page: 1 }),
    enabled: Boolean(user),
  });

  const productsById = useMemo(() => {
    const map = new Map<string, Product>();
    (productsData?.items ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [productsData]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getAdminOrder(orderId),
    enabled: Boolean(user) && Boolean(orderId),
    retry: 1,
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

  // Basic admin check (in real app, use role check)
  if (!user) {
    return (
      <EmptyState
        title="Unauthorized"
        description="You must be logged in to view this page."
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="border-b px-6 py-4">
              <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-20 w-20 animate-pulse rounded-md bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-48 animate-pulse rounded-md bg-muted" />
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Orders
          </Link>
        </Button>
        <EmptyState
          title="Order not found"
          description={String((error as Error)?.message ?? "We couldn't find the order you're looking for.")}
          action={
            <div className="flex gap-2">
               <Button variant="outline" onClick={() => refetch()}>Retry</Button>
               <Button asChild variant="default">
                 <Link href="/admin/orders">View All Orders</Link>
               </Button>
            </div>
          }
        />
      </div>
    );
  }

  const { order } = data;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group -ml-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
            Back to Orders
          </Link>
        </Button>
        <div className="flex gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions <MoreVertical className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
              <DropdownMenuItem>Mark as Fulfilled</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Order Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
             <Badge variant={statusVariant(order.status)} className="h-6 px-2.5 text-xs capitalize">
               {order.status}
             </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Placed on {orderDate}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer Info */}
          <Card className="border-none shadow-md">
             <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
                <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Contact Info</p>
                   <p className="font-medium">{order.shippingAddress.fullName}</p>
                   <p className="text-sm text-muted-foreground">user-{order.userId}@example.com</p> {/* Mock email */}
                   <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</p>
                   <div className="text-sm">
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <Card className="border-none shadow-md">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item) => {
                  const product = productsById.get(item.productId);
                  return (
                    <div key={item.productId} className="flex flex-col sm:flex-row gap-4 p-6 transition-colors hover:bg-muted/5 group">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted shadow-sm">
                        <ImageWithFallback
                           src={product?.images[0].src || "/placeholder.svg"}
                           alt={product?.name || item.productId}
                           fill
                           className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-2 sm:gap-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-base">
                              {product?.name ?? item.productId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Product ID: {item.productId}
                            </p>
                          </div>
                          <div className="text-right">
                             <div className="font-semibold">
                               {formatPrice(item.unitPrice.amount * item.quantity, item.unitPrice.currency)}
                             </div>
                             <p className="text-xs text-muted-foreground">
                               {item.quantity} x {formatPrice(item.unitPrice.amount, item.unitPrice.currency)}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="border-none shadow-md">
            <CardHeader className="px-6 py-4 border-b bg-muted/30">
              <CardTitle className="text-base font-medium">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.total.amount, order.total.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-baseline">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">{formatPrice(order.total.amount, order.total.currency)}</span>
              </div>
            </CardContent>
          </Card>
          
           <Card className="border-none shadow-md">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="relative border-l-2 border-muted pl-6 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-background bg-primary" />
                  <p className="text-sm font-medium leading-none mb-1">Order Placed</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
               </div>
               {/* Add more timeline events based on status if needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
