"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ShoppingCart, User } from "lucide-react";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { routes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { isAdminUser } from "@/features/auth/is-admin";
import { categories } from "@/services/mock/db";

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
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href={routes.home} className="font-semibold tracking-tight">
            EcommerceAI
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 md:w-[360px]">
                    <NavigationMenuLink asChild className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                      <Link href={routes.products}>All products</Link>
                    </NavigationMenuLink>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((c) => (
                        <NavigationMenuLink
                          key={c.id}
                          asChild
                          className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          <Link href={`${routes.products}?category=${encodeURIComponent(c.slug)}`}>
                            {c.name}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 md:w-[260px]">
                    <NavigationMenuLink asChild className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                      <Link href={routes.about}>About</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                      <Link href={routes.contact}>Contact</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                      <Link href={routes.faq}>FAQ</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
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
                      } catch {
                        toast.error("Sign out failed");
                      }
                    }}
                  >
                    Logout
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
        </div>
      </Container>
    </header>
  );
}
