/**
 * Header Component
 *
 * Main site header with logo, search bar, navigation, and action buttons.
 * Responsive design with sticky positioning and mobile menu toggle.
 *
 * @module components/layout
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Laptop,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/features/cart/store";
import { useCurrentUser } from "@/hooks/use-auth";
import { NAV_LINKS } from "@/lib/constants";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { CartDrawer } from "./cart-drawer";

/**
 * Main site header component
 *
 * Features:
 * - Sticky positioning on scroll
 * - Logo with home link
 * - Search bar (expandable on mobile)
 * - Desktop navigation links
 * - Cart icon with item count badge
 * - User menu (authenticated) or login link (guest)
 * - Mobile menu toggle
 */
export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const cartStore = useCartStore();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  const itemCount = cartStore.getItemCount();
  const isAuthenticated = !!user;

  // Close search when clicking outside
  const searchRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Mobile Menu Toggle + Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <MobileMenu onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold"
                aria-label="TechStore Home"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Laptop className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="hidden sm:inline">TechStore</span>
              </Link>

              {/* Desktop Navigation */}
              <nav
                className="hidden lg:flex items-center gap-1 ml-4"
                role="navigation"
                aria-label="Main navigation"
              >
                {NAV_LINKS.main.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === link.href
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Search Bar */}
            <div
              ref={searchRef}
              className={cn(
                "flex-1 max-w-md transition-all duration-300",
                isSearchOpen ? "max-w-lg" : "hidden md:block"
              )}
            >
              <SearchBar
                isExpanded={isSearchOpen}
                onExpandedChange={setIsSearchOpen}
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>

              {/* User Menu / Login */}
              {isAuthenticated ? (
                <UserMenu user={user} />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  aria-label="Sign in"
                >
                  <Link href="/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => cartStore.openCart()}
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar (Expanded) */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 animate-in slide-in-from-top-2">
              <SearchBar
                isExpanded={true}
                onExpandedChange={setIsSearchOpen}
                autoFocus
              />
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default Header;
