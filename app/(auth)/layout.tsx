/**
 * Auth Route Group Layout
 * 
 * This layout wraps all authentication pages (login, register).
 * It provides a clean, centered layout without the main navigation.
 */

import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

/**
 * Auth Layout Metadata
 */
export const metadata = {
  title: {
    template: `%s | ${APP_CONFIG.name}`,
    default: `Authentication | ${APP_CONFIG.name}`,
  },
};

/**
 * Auth Layout Component
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple Header with Logo */}
      <header className="border-b bg-background px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground hover:text-primary"
          >
            {APP_CONFIG.name}
          </Link>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t bg-background px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
