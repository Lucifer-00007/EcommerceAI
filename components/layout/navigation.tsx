/**
 * Navigation Component
 *
 * Desktop and mobile navigation with dropdown menus for categories.
 * Active state highlighting and responsive design.
 *
 * @module components/layout
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-products";
import type { Category } from "@/types";

export interface NavigationProps {
  /** Additional CSS classes */
  className?: string;
  /** Variant of navigation */
  variant?: "default" | "minimal";
}

/**
 * Desktop navigation with category dropdowns
 *
 * Features:
 * - Horizontal menu layout
 * - Dropdown menus for categories with subcategories
 * - Active state highlighting for current page
 * - Images in category dropdowns
 */
export function Navigation({ className, variant = "default" }: NavigationProps) {
  const pathname = usePathname();
  const { data: categories, isLoading } = useCategories();

  // Get top-level categories
  const topCategories = React.useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) => !cat.parentId);
  }, [categories]);

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Main nav items
  const mainNavItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/deals", label: "Deals" },
  ];

  if (variant === "minimal") {
    return (
      <nav
        className={cn("hidden lg:flex items-center gap-1", className)}
        role="navigation"
        aria-label="Main navigation"
      >
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isActive(item.href)}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={cn("hidden lg:flex items-center gap-1", className)}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Home Link */}
      <NavLink href="/" label="Home" isActive={isActive("/")} />

      {/* Products with Categories Dropdown */}
      {isLoading ? (
        <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
      ) : (
        <CategoriesDropdown
          categories={topCategories}
          isActive={isActive("/products") || isActive("/categories")}
        />
      )}

      {/* Deals Link */}
      <NavLink href="/deals" label="Deals" isActive={isActive("/deals")} />
    </nav>
  );
}

/**
 * Individual navigation link
 */
function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

/**
 * Categories dropdown menu
 */
function CategoriesDropdown({
  categories,
  isActive,
}: {
  categories: Category[];
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "px-3 py-2 h-auto font-medium",
            isActive && "bg-accent text-foreground"
          )}
        >
          Categories
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[600px] p-0"
        sideOffset={8}
      >
        <div className="grid grid-cols-3 gap-4 p-4">
          {/* Featured Categories Column */}
          <div className="col-span-1 border-r pr-4">
            <h4 className="font-semibold mb-3 text-sm">All Categories</h4>
            <div className="space-y-1">
              <DropdownMenuItem asChild>
                <Link
                  href="/products"
                  className="cursor-pointer font-medium text-primary"
                >
                  All Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.slice(0, 6).map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>

          {/* Featured Category with Image */}
          <div className="col-span-2">
            <h4 className="font-semibold mb-3 text-sm">Featured</h4>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3]"
                >
                  {category.image ? (
                    <>
                      <img
                        src={category.image.url}
                        alt={category.image.alt}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </>
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold">{category.name}</p>
                    {category.productCount && (
                      <p className="text-white/80 text-xs">
                        {category.productCount} products
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Mobile Navigation Component
 *
 * Simple accordion-based navigation for mobile devices
 */
export function MobileNavigation() {
  const pathname = usePathname();
  const { data: categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = React.useState(false);

  const topCategories = React.useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) => !cat.parentId);
  }, [categories]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/deals", label: "Deals" },
  ];

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg animate-in slide-in-from-top-2">
          <nav className="container mx-auto px-4 py-4" aria-label="Mobile navigation">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Categories Section */}
              <div className="pt-4 mt-4 border-t">
                <h4 className="px-3 text-sm font-semibold text-muted-foreground mb-2">
                  Categories
                </h4>
                {isLoading ? (
                  <div className="space-y-2 px-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 bg-muted animate-pulse rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {topCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navigation;
