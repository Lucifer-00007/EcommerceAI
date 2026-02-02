"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart, Menu, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { isAdminUser } from "@/features/auth/is-admin";

export function SiteHeader() {
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const isAdmin = isAdminUser(user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <Link href={routes.home} className="hidden text-xl font-bold tracking-tight sm:block">
            Lumina
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground pr-6 lg:flex">
            <Link href={routes.home} className="hover:text-primary">
              Home
            </Link>
            <Link href={routes.products} className="hover:text-primary">
              Shop
            </Link>
            <Link href={routes.clothes} className="hover:text-primary">
              Clothes
            </Link>
            <Link href={routes.about} className="hover:text-primary">
              About
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={routes.accountProfile}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={routes.accountOrders}>Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={routes.admin}>Admin</Link>
                      </DropdownMenuItem>
                    </>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await logout();
                        toast.success("Signed out");
                      } catch (e) {
                        toast.error((e as Error)?.message ?? "Sign out failed");
                      }
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={routes.login}>Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={routes.register}>Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Favorites"
            className="rounded-full text-muted-foreground hover:text-primary"
            onClick={() => toast("Favorites are not implemented in this demo.")}
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button asChild variant="ghost" size="icon" aria-label="Open cart" className="rounded-full">
            <Link href={routes.cart} className="relative">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              {itemCount > 0 ? (
                <span className="absolute right-1 top-1 inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              ) : null}
            </Link>
          </Button>

          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="rounded-full md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </Container>
    </header>
  );
}
