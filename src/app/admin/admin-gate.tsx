"use client";

import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { isAdminUser } from "@/features/auth/is-admin";
import { routes } from "@/lib/routes";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Admin access required"
        description="Login to access the admin console."
        action={
          <Button asChild>
            <Link href={routes.login}>Login</Link>
          </Button>
        }
      />
    );
  }

  if (!isAdminUser(user)) {
    return (
      <EmptyState
        title="Not authorized"
        description="Your account does not have admin access."
        action={
          <Button asChild variant="secondary">
            <Link href={routes.home}>Go home</Link>
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}

