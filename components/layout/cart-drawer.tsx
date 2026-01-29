/**
 * Cart Drawer Component
 *
 * Slide-out cart drawer with item list, quantity controls, and checkout actions.
 * Uses shadcn Sheet component for the drawer functionality.
 *
 * @module components/layout
 */

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/use-cart";
import { EmptyState } from "@/components/common";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

/**
 * Cart Drawer Component
 *
 * Displays a slide-out drawer with cart items, subtotal, and checkout actions.
 * Connected to the cart store's isOpen state.
 */
export function CartDrawer() {
  const cartStore = useCartStore();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const { items, isOpen, closeCart, getSubtotal, getTotal, getShipping } = cartStore;
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  const handleQuantityChange = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      removeFromCart.mutate({ productId, variantId });
    } else {
      updateCartItem.mutate({ productId, quantity, variantId });
    }
  };

  const handleRemoveItem = (productId: string, variantId?: string) => {
    removeFromCart.mutate({ productId, variantId });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        {/* Header */}
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse our products and add items to your cart."
              action={{
                label: "Continue Shopping",
                href: "/products",
              }}
            />
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 -mx-6 px-6 overflow-y-auto">
              <div className="space-y-4">
                {items.map((item) => {
                  const image = item.variant?.images?.[0] || item.product.images[0];
                  const price = item.variant?.price ?? item.product.price;
                  const itemTotal = price * item.quantity;

                  return (
                    <div
                      key={`${item.productId}-${item.variantId || "default"}`}
                      className="flex gap-4 py-2"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted shrink-0">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:underline line-clamp-1"
                            onClick={closeCart}
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="text-sm font-medium">
                            {formatCurrency(price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variantId
                                )
                              }
                              disabled={updateCartItem.isPending}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1,
                                  item.variantId
                                )
                              }
                              disabled={updateCartItem.isPending}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              handleRemoveItem(item.productId, item.variantId)
                            }
                            disabled={removeFromCart.isPending}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Free Shipping Progress */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="py-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Footer */}
            <SheetFooter className="flex-col gap-4 pt-4">
              {/* Totals */}
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full">
                <Button
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link href="/checkout" onClick={closeCart}>
                    Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
