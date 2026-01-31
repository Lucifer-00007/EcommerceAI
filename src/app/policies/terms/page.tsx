import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service for EcommerceAI.",
};

export default function TermsPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
          <p className="text-muted-foreground">A demo terms page for a storefront site.</p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p>
              EcommerceAI is a demo storefront. Any orders, payments, and shipping flows are mocked
              and provided for demonstration purposes only.
            </p>
            <p>
              For production usage, consult legal counsel and ensure compliance with applicable
              laws, tax rules, and consumer protection requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

