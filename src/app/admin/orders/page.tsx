import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCatalogProducts } from "@/services/admin/catalog-store";
import { orders } from "@/services/mock/db";
import type { OrderStatus } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Admin orders",
  description: "View orders in the admin console.",
};

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

export default function AdminOrdersPage() {
  const productsById = new Map(getCatalogProducts().map((p) => [p.id, p]));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground">Read-only view of mocked orders.</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="space-y-3 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium">Order {order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
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

              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p>{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.email}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{formatPrice(order.total.amount, order.total.currency)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

