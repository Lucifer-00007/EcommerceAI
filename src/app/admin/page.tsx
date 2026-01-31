import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export default function AdminPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-medium">Products</p>
          <p className="text-sm text-muted-foreground">
            Create, edit, and delete products. Changes affect the storefront APIs.
          </p>
          <Link href={routes.adminProducts} className="text-sm underline">
            Manage products
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-medium">Pages</p>
          <p className="text-sm text-muted-foreground">
            Toggle footer and navigation links for marketing pages.
          </p>
          <Link href={routes.adminPages} className="text-sm underline">
            Manage pages
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-medium">Orders</p>
          <p className="text-sm text-muted-foreground">Review recent orders (mocked data).</p>
          <Link href={routes.adminOrders} className="text-sm underline">
            View orders
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-medium">Payments</p>
          <p className="text-sm text-muted-foreground">
            Configure payment provider settings (demo fields).
          </p>
          <Link href={routes.adminPayments} className="text-sm underline">
            Payment settings
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-medium">Social</p>
          <p className="text-sm text-muted-foreground">
            Configure social links for the storefront footer.
          </p>
          <Link href={routes.adminSocial} className="text-sm underline">
            Social settings
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
