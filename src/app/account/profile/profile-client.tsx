"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/features/account/api";
import { useAuthStore } from "@/features/auth/store";
import { routes } from "@/lib/routes";

export function ProfileClient() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["account", "profile"],
    queryFn: () => getProfile(),
    enabled: Boolean(user),
  });

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in required"
        description="Login to view your profile."
        action={
          <Button asChild>
            <Link href={routes.login}>Login</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-medium">{data?.user.name ?? user.name}</p>
            <p className="text-sm text-muted-foreground">{data?.user.email ?? user.email}</p>
            {isLoading ? <p className="text-sm text-muted-foreground">Syncing…</p> : null}
            {isError ? <p className="text-sm text-destructive">Unable to load profile.</p> : null}
          </div>
          <Button
            type="button"
            variant="secondary"
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

