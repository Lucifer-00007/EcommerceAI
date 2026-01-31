import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Shipping and returns policy.",
};

export default function ShippingReturnsPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Shipping & returns</h1>
          <p className="text-muted-foreground">A demo policy page for a storefront site.</p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p>
              Shipping is currently mocked in this demo. In a production store, integrate a real
              carrier rate service and show delivery estimates at checkout.
            </p>
            <p>
              Returns should be supported with clear timelines, condition requirements, and a
              customer support workflow.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

