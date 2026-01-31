import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Privacy policy for EcommerceAI.",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
          <p className="text-muted-foreground">A demo policy page for a storefront site.</p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p>
              This demo does not collect real payment information. Any data entered into forms is
              used only for the in-app experience.
            </p>
            <p>
              For a production store, ensure you implement consent management, data retention
              policies, and secure handling of customer information.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

