/**
 * Mobile Menu Component
 *
 * Slide-out mobile navigation with category accordion and auth buttons.
 * Uses shadcn Sheet component for the slide-out functionality.
 *
 * @module components/layout
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Grid3X3,
  Tag,
  User,
  LogIn,
  UserPlus,
  Package,
  Heart,
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/use-products";
import { useCurrentUser } from "@/hooks/use-auth";

export interface MobileMenuProps {
  /** Callback when navigation occurs */
  onNavigate?: () => void;
}

/**
 * Mobile menu with categories accordion and navigation links
 *
 * Features:
 * - Categories accordion with images
 * - Main navigation links
 * - Auth buttons (login/register or user links)
 * - Responsive design for mobile devices
 */
export function MobileMenu({ onNavigate }: MobileMenuProps) {
  const pathname = usePathname();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const isAuthenticated = !!user;

  const handleNavigate = () => {
    onNavigate?.();
  };

  // Main navigation items with icons
  const mainNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { href: "/categories", label: "Categories", icon: Grid3X3 },
    { href: "/deals", label: "Deals", icon: Tag },
  ];

  // Account navigation items
  const accountNavItems = [
    { href: "/account", label: "My Account", icon: User },
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  ];

  // Support navigation items
  const supportNavItems = [
    { href: "/contact", label: "Contact Us", icon: HelpCircle },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-lg font-semibold">Menu</span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <nav className="p-4" aria-label="Mobile navigation">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <Separator />

        {/* Categories Accordion */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">
            Categories
          </h3>
          {categoriesLoading ? (
            <div className="space-y-2 px-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-muted rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {categories
                .filter((cat) => !cat.parentId) // Only show top-level categories
                .map((category) => (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    className="border-0"
                  >
                    <AccordionTrigger className="py-2 px-3 hover:no-underline hover:bg-accent/50 rounded-md">
                      <div className="flex items-center gap-3">
                        {category.image && (
                          <div className="h-8 w-8 rounded-md overflow-hidden bg-muted shrink-0">
                            <img
                              src={category.image.url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <span>{category.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-1">
                        {/* Link to parent category */}
                        <Link
                          href={`/categories/${category.slug}`}
                          onClick={handleNavigate}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md"
                        >
                          All {category.name}
                        </Link>
                        {/* Child categories */}
                        {category.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/categories/${child.slug}`}
                            onClick={handleNavigate}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          ) : null}
        </div>

        <Separator />

        {/* Account Section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">
            Account
          </h3>
          {isAuthenticated ? (
            <div className="space-y-1">
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavigate}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                      isActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 px-3">
              <Button
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href="/login" onClick={handleNavigate}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href="/register" onClick={handleNavigate}>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Link>
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Support Section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">
            Support
          </h3>
          <div className="space-y-1">
            {supportNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
