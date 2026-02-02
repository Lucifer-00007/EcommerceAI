"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Truck, 
  AlertCircle,
  RefreshCw,
  Mail,
  HelpCircle
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
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
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading account...</p>
          </div>
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
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
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
          <Link href={routes.accountOrders}>
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group -ml-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href={routes.accountOrders}>
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
            Back to Orders
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <HelpCircle className="mr-2 h-4 w-4" /> Support
          </Button>
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
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">
            Return Items
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Buy Again
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tracking Progress */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-muted/20">
            <CardHeader className="border-b bg-muted/30 px-6 py-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Shipping Update
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="relative pl-4">
                  {/* Timeline Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-muted" />
                  
                  {/* Timeline Items */}
                  <div className="relative pl-8 pb-8">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-4 border-background bg-green-500 shadow-sm z-10" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <p className="font-medium text-foreground">Delivered</p>
                        <p className="text-sm text-muted-foreground">Package left at front door</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full w-fit">
                        Feb 02, 2:30 PM
                      </span>
                    </div>
                  </div>

                  <div className="relative pl-8 pb-8">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-sm z-10" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <p className="font-medium text-foreground">Out for Delivery</p>
                        <p className="text-sm text-muted-foreground">With local courier</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full w-fit">
                        Feb 02, 8:15 AM
                      </span>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-4 border-background bg-muted-foreground/30 z-10" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <p className="font-medium text-muted-foreground">Shipped</p>
                        <p className="text-sm text-muted-foreground">Departed fulfillment center</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full w-fit">
                        Feb 01, 4:00 PM
                      </span>
                    </div>
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
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted shadow-sm group-hover:shadow-md transition-all">
                        <ImageWithFallback
                           src={product?.images[0].src || "/placeholder.svg"}
                           alt={product?.name || item.productId}
                           fill
                           className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-4 sm:gap-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <Link 
                              href={`${routes.products}/${product?.slug ?? item.productId}`}
                              className="font-semibold text-lg hover:underline hover:text-primary transition-colors line-clamp-2"
                            >
                              {product?.name ?? item.productId}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Category: {product?.categoryId || "General"}
                            </p>
                          </div>
                          <div className="text-right">
                             <div className="font-semibold text-lg">
                               {formatPrice(item.unitPrice.amount * item.quantity, item.unitPrice.currency)}
                             </div>
                             {item.quantity > 1 && (
                               <p className="text-xs text-muted-foreground">
                                 {formatPrice(item.unitPrice.amount, item.unitPrice.currency)} each
                               </p>
                             )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <Badge variant="outline" className="font-normal bg-muted/50">
                             Qty: {item.quantity}
                           </Badge>
                           <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                             Write a Review
                           </Button>
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
              <CardTitle className="text-base font-medium">Payment Summary</CardTitle>
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
            <div className="bg-muted/30 p-4 border-t text-xs text-muted-foreground text-center">
              Paid with Visa ending in 4242
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="border-none shadow-md">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="font-semibold text-base mb-2">{order.shippingAddress.fullName}</div>
              <div className="text-muted-foreground space-y-1 leading-relaxed">
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center gap-2 text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                <span>Standard Shipping</span>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-950/10">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                Need Help?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Issues with your order? Our support team is here to help you 24/7.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full bg-background">
                  Track Shipment
                </Button>
                <Button variant="ghost" size="sm" className="w-full hover:bg-background/80">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}