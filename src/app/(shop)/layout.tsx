/**
 * Shop Route Group Layout
 * 
 * This layout wraps all shop pages (home, products, cart, etc.).
 * It includes the main header and footer navigation.
 */

import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

/**
 * Shop Layout Metadata
 */
export const metadata = {
  title: {
    template: `%s | ${APP_CONFIG.name}`,
    default: APP_CONFIG.name,
  },
  description: APP_CONFIG.description,
};

/**
 * Shop Layout Component
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header Placeholder - Will be implemented in components/layout/Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            {APP_CONFIG.name}
          </Link>

          {/* Navigation Placeholder */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Link href="/cart" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Cart
            </Link>
          </nav>

          {/* Auth Links Placeholder */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer Placeholder */}
      <footer className="border-t bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
