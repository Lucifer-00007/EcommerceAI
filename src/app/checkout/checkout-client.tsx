"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store";
import { getProducts } from "@/features/products/api";
import { routes } from "@/lib/routes";
import type { Product } from "@/types/ecommerce";
import { shippingAddressSchema } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

const paymentSchema = z.object({
  nameOnCard: z.string().min(1),
  cardNumber: z.string().min(12),
  expiry: z.string().min(4),
  cvc: z.string().min(3),
});

const checkoutSchema = z.object({
  shipping: shippingAddressSchema,
  payment: paymentSchema,
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const { data } = useQuery({
    queryKey: ["products", "checkout-summary"],
    queryFn: () => getProducts({ pageSize: 48, page: 1 }),
  });

  const productsById = useMemo(() => {
    const map = new Map<string, Product>();
    (data?.items ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [data]);

  const lines = useMemo(() => {
    return items
      .map((line) => ({
        line,
        product: productsById.get(line.productId) ?? null,
      }))
      .filter((x) => x.product !== null);
  }, [items, productsById]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, { line, product }) => {
      if (!product) return sum;
      return sum + product.price.amount * line.quantity;
    }, 0);
    return { subtotal, currency: lines[0]?.product?.price.currency ?? "USD" };
  }, [lines]);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        fullName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "US",
      },
      payment: {
        nameOnCard: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
      },
    },
    mode: "onBlur",
  });

  if (!items.length) {
    return (
      <EmptyState
        title="Nothing to checkout"
        description="Your cart is empty."
        action={
          <Button asChild>
            <Link href={routes.products}>Shop products</Link>
          </Button>
        }
      />
    );
  }

  const shippingErrors = form.formState.errors.shipping;
  const paymentErrors = form.formState.errors.payment;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async () => {
            clear();
            toast.success("Order placed");
            router.push(routes.accountOrders);
          })}
        >
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="font-medium">Shipping</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" {...form.register("shipping.fullName")} />
                  {shippingErrors?.fullName ? (
                    <p className="text-xs text-destructive">{shippingErrors.fullName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("shipping.email")} />
                  {shippingErrors?.email ? (
                    <p className="text-xs text-destructive">{shippingErrors.email.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("shipping.phone")} />
                  {shippingErrors?.phone ? (
                    <p className="text-xs text-destructive">{shippingErrors.phone.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address1">Address</Label>
                  <Input id="address1" {...form.register("shipping.address1")} />
                  {shippingErrors?.address1 ? (
                    <p className="text-xs text-destructive">{shippingErrors.address1.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address2">Address line 2</Label>
                  <Input id="address2" {...form.register("shipping.address2")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("shipping.city")} />
                  {shippingErrors?.city ? (
                    <p className="text-xs text-destructive">{shippingErrors.city.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">State / Region</Label>
                  <Input id="region" {...form.register("shipping.region")} />
                  {shippingErrors?.region ? (
                    <p className="text-xs text-destructive">{shippingErrors.region.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input id="postalCode" {...form.register("shipping.postalCode")} />
                  {shippingErrors?.postalCode ? (
                    <p className="text-xs text-destructive">{shippingErrors.postalCode.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...form.register("shipping.country")} />
                  {shippingErrors?.country ? (
                    <p className="text-xs text-destructive">{shippingErrors.country.message}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="font-medium">Payment</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nameOnCard">Name on card</Label>
                  <Input id="nameOnCard" {...form.register("payment.nameOnCard")} />
                  {paymentErrors?.nameOnCard ? (
                    <p className="text-xs text-destructive">{paymentErrors.nameOnCard.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input id="cardNumber" inputMode="numeric" {...form.register("payment.cardNumber")} />
                  {paymentErrors?.cardNumber ? (
                    <p className="text-xs text-destructive">{paymentErrors.cardNumber.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" {...form.register("payment.expiry")} />
                  {paymentErrors?.expiry ? (
                    <p className="text-xs text-destructive">{paymentErrors.expiry.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" inputMode="numeric" {...form.register("payment.cvc")} />
                  {paymentErrors?.cvc ? (
                    <p className="text-xs text-destructive">{paymentErrors.cvc.message}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Place order
            </Button>
            <Button asChild variant="secondary">
              <Link href={routes.cart}>Back to cart</Link>
            </Button>
          </div>
        </form>
      </div>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-6">
          <p className="text-lg font-medium">Order summary</p>
          <Separator />
          <div className="space-y-3">
            {lines.map(({ line, product }) => {
              if (!product) return null;
              return (
                <div key={line.productId} className="flex items-center justify-between gap-3 text-sm">
                  <span className="line-clamp-1">
                    {product.name} × {line.quantity}
                  </span>
                  <span>
                    {formatPrice(product.price.amount * line.quantity, product.price.currency)}
                  </span>
                </div>
              );
            })}
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(totals.subtotal, totals.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
