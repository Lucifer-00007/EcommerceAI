"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { routes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";

export function SiteHeader() {
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return (
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href={routes.home} className="font-semibold tracking-tight">
            EcommerceAI
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link href={routes.products} className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Link href={routes.cart} className="text-muted-foreground hover:text-foreground">
              Cart
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Open cart">
            <Link href={routes.cart} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium text-primary-foreground">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" aria-label="Account">
            <Link href={user ? routes.accountProfile : routes.login}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}

