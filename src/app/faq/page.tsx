import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions.",
};

const faqs = [
  {
    q: "Is this a real store?",
    a: "This is a demo storefront. Products, checkout, and orders are mocked to showcase architecture and UI patterns.",
  },
  {
    q: "Do you support dark mode?",
    a: "Yes. Theme tokens are class-based and you can switch between system, light, and dark from the header.",
  },
  {
    q: "Can I add a real payment gateway?",
    a: "The UI is structured for real integrations. The admin console includes a payments settings page suitable for wiring to Stripe/PayPal.",
  },
];

export default function FaqPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
          <p className="text-muted-foreground">Answers to common questions.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f) => (
            <Card key={f.q}>
              <CardContent className="space-y-2 p-6">
                <p className="font-medium">{f.q}</p>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={routes.products}>Browse products</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={routes.contact}>Contact</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

