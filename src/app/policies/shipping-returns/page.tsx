import type { Metadata } from "next";
import { Box, RotateCcw, Truck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/common/reveal";
import { routes } from "@/lib/routes";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Shipping and returns policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-secondary/20 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center relative">
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Shipping & Returns</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to know about getting your order and sending it back if needed.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl space-y-8">
            <Reveal delay={0.1}>
              <Card className="border shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Truck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Shipping Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground leading-relaxed px-6 sm:px-8 pb-8">
                  <p>
                    We currently offer free standard shipping on all orders over $50. For orders under $50, a flat rate of $5.99 applies.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-left inline-block">
                    <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                    <li><strong>Express Shipping:</strong> 1-2 business days ($15.00)</li>
                    <li><strong>International Shipping:</strong> 7-14 business days (Rates calculated at checkout)</li>
                  </ul>
                  <p className="text-sm italic bg-secondary/30 p-4 rounded-lg border mt-4">
                    Note: Since this is a demo store, no physical products will be shipped. The checkout process simulates a real transaction flow.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.2}>
              <Card className="border shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Returns & Exchanges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground leading-relaxed px-6 sm:px-8 pb-8">
                  <p>
                    We want you to love your purchase. If you&apos;re not completely satisfied, you can return most items within 30 days of delivery for a full refund or exchange.
                  </p>
                  <div className="text-left inline-block w-full">
                    <h3 className="text-foreground font-semibold mb-2 text-center sm:text-left">Conditions for Return</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Items must be unworn, unwashed, and in original condition.</li>
                      <li>Tags must still be attached.</li>
                      <li>Proof of purchase is required.</li>
                    </ul>
                  </div>
                  <p>
                    To initiate a return, please contact our support team or visit your account dashboard.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.3}>
              <Card className="border shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Box className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Order Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground leading-relaxed px-6 sm:px-8 pb-8 text-center">
                  <p>
                    Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order status directly from your account page.
                  </p>
                  <div className="pt-4 flex justify-center">
                    <Button asChild variant="outline">
                      <Link href={routes.accountOrders}>View My Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}

