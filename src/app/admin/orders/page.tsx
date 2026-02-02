import type { Metadata } from "next";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCatalogProducts } from "@/services/admin/catalog-store";
import { orders } from "@/services/mock/db";
import type { OrderStatus } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Admin orders",
  description: "View orders in the admin console.",
};

function statusVariant(status: OrderStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "fulfilled":
      return "default"; // "Shipped" style usually
    case "paid":
      return "secondary";
    case "pending":
      return "outline"; // "Pending" style
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function AdminOrdersPage() {
  const productsById = new Map(getCatalogProducts().map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground">Manage your recent purchases and track shipments.</p>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
        </CardHeader>
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
                {orders.map((order) => (
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
                    <td className="p-6 align-middle font-medium">
                      {formatPrice(order.total.amount, order.total.currency)}
                    </td>
                    <td className="p-6 align-middle text-muted-foreground">
                      {order.shippingAddress.email}
                    </td>
                    <td className="p-6 align-middle text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">View details</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

