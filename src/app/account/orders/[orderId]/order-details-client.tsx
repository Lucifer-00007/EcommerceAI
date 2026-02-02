"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/features/account/api";
import { useAuthStore } from "@/features/auth/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { OrderStatus, Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
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

export function OrderDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || "";
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  const { data: productsData } = useQuery({
    queryKey: ["products", "order-details"],
    queryFn: () => getProducts({ pageSize: 100, page: 1 }),
    enabled: Boolean(user),
  });

  const productsById = useMemo(() => {
    const map = new Map<string, Product>();
    (productsData?.items ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [productsData]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["account", "order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: Boolean(user) && Boolean(orderId),
    retry: 1,
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
        description="Login to view this order."
        action={
          <Button asChild>
            <Link href={`${routes.login}?redirect=${routes.accountOrders}/${orderId}`}>Login</Link>
          </Button>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
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
          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !data?.order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" asChild>
          <Link href={routes.accountOrders}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
        <EmptyState
          title="Order not found"
          description={String((error as Error)?.message ?? "We couldn't find the order you're looking for.")}
          action={
            <div className="flex gap-2">
               <Button variant="outline" onClick={() => refetch()}>Retry</Button>
               <Button asChild variant="default">
                 <Link href={routes.accountOrders}>View All Orders</Link>
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" asChild>
               <Link href={routes.accountOrders}>
                 <ArrowLeft className="h-4 w-4" />
               </Link>
             </Button>
             <h2 className="text-2xl font-bold tracking-tight">Order #{order.id}</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            Placed on {orderDate}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-8 sm:ml-0">
          <Badge variant={statusVariant(order.status)} className="h-7 px-3 text-sm capitalize">
            {order.status}
          </Badge>
          <Button variant="outline" size="sm">
            Download Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item) => {
                  const product = productsById.get(item.productId);
                  return (
                    <div key={item.productId} className="flex gap-4 p-6 transition-colors hover:bg-muted/30">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                        <ImageWithFallback
                           src={product?.images[0].src || "/placeholder.svg"}
                           alt={product?.name || item.productId}
                           fill
                           className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-1">
                          <Link 
                            href={`${routes.products}/${product?.slug ?? item.productId}`}
                            className="font-medium hover:underline hover:text-primary transition-colors line-clamp-2"
                          >
                            {product?.name ?? item.productId}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(item.unitPrice.amount, item.unitPrice.currency)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="text-sm font-medium">
                             {formatPrice(item.unitPrice.amount * item.quantity, item.unitPrice.currency)}
                           </div>
                           {/* Optional: Add "Write a Review" button here later */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Shipping Update
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="relative border-l-2 border-muted pl-6 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-background bg-green-500" />
                  <p className="text-sm font-medium leading-none mb-1">Order Delivered</p>
                  <p className="text-xs text-muted-foreground">Feb 02, 2026 - 2:30 PM</p>
               </div>
               <div className="relative border-l-2 border-muted pl-6 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-background bg-muted-foreground" />
                  <p className="text-sm font-medium leading-none mb-1">Out for Delivery</p>
                  <p className="text-xs text-muted-foreground">Feb 02, 2026 - 8:15 AM</p>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary & Details */}
        <div className="space-y-6">
          <Card>
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
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total.amount, order.total.currency)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="font-medium mb-1">{order.shippingAddress.fullName}</div>
              <div className="text-muted-foreground space-y-0.5">
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-12 rounded bg-muted border flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expiry 12/28</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}