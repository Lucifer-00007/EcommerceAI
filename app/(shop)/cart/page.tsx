/**
 * Cart Page
 * 
 * Displays the shopping cart with items, quantities, and pricing.
 * Allows users to modify quantities, remove items, and proceed to checkout.
 * 
 * This is a Client Component because it needs to interact with cart state.
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Cart Page Component
 */
export default function CartPage() {
  // Cart state will be managed by Zustand in a future task
  const cartItems: unknown[] = []; // Placeholder
  const isEmpty = cartItems.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      {isEmpty ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-16">
          <p className="mb-4 text-lg text-muted-foreground">
            Your cart is empty
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        /* Cart with Items */
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items - Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cart items will be displayed here...
                </p>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Estimated Total</span>
                  <span>$0.00</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
