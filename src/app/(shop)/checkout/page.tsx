/**
 * Checkout Page
 * 
 * Multi-step checkout process: Shipping -> Payment -> Review.
 * Collects shipping and payment information, displays order summary.
 * 
 * This is a Client Component because it manages form state and validation.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CHECKOUT_CONFIG } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";

/**
 * Checkout Step Type
 */
type CheckoutStep = "shipping" | "payment" | "review";

/**
 * Checkout Page Component
 */
export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back to Cart Link */}
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

      {/* Checkout Progress - Placeholder */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {CHECKOUT_CONFIG.steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}. {step.label}
              </div>
              {index < CHECKOUT_CONFIG.steps.length - 1 && (
                <Separator className="mx-4 w-8" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form - Placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === "shipping" && "Shipping Information"}
                {currentStep === "payment" && "Payment Information"}
                {currentStep === "review" && "Review Order"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {currentStep === "shipping" && "Shipping form will appear here..."}
                {currentStep === "payment" && "Payment form will appear here..."}
                {currentStep === "review" && "Order review will appear here..."}
              </p>
              
              {/* Step Navigation - Placeholder */}
              <div className="mt-6 flex justify-between">
                {currentStep !== "shipping" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStep === "payment") setCurrentStep("shipping");
                      if (currentStep === "review") setCurrentStep("payment");
                    }}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  className={currentStep === "shipping" ? "ml-auto" : ""}
                  onClick={() => {
                    if (currentStep === "shipping") setCurrentStep("payment");
                    if (currentStep === "payment") setCurrentStep("review");
                    if (currentStep === "review") {
                      // Place order
                      alert("Order placed!");
                    }
                  }}
                >
                  {currentStep === "review" ? "Place Order" : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary - Placeholder */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Order items will appear here...
              </p>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
