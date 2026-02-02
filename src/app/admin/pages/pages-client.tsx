"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getAdminSettings, updateAdminSettings } from "@/features/admin/api";

export function AdminPagesClient() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAdminSettings(),
  });

  const mutation = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => updateAdminSettings(patch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Saved");
    },
    onError: (e) => toast.error((e as Error)?.message ?? "Save failed"),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading settings…</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load settings"
        description={String((error as Error)?.message ?? "")}
      />
    );
  }

  const pages = data?.settings.pages;
  if (!pages) return <EmptyState title="No settings" description="Try refreshing." />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Pages</h2>
        <p className="text-sm text-muted-foreground">Toggle visibility of footer/company links.</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="showAbout" className="text-base">About Page</Label>
              <p className="text-sm text-muted-foreground">Show the About Us link in the footer.</p>
            </div>
            <Checkbox
              id="showAbout"
              checked={pages.showAbout}
              onCheckedChange={(v) => mutation.mutate({ pages: { showAbout: Boolean(v) } })}
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="showContact" className="text-base">Contact Page</Label>
              <p className="text-sm text-muted-foreground">Show the Contact link in the footer.</p>
            </div>
            <Checkbox
              id="showContact"
              checked={pages.showContact}
              onCheckedChange={(v) => mutation.mutate({ pages: { showContact: Boolean(v) } })}
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="showFaq" className="text-base">FAQ Page</Label>
              <p className="text-sm text-muted-foreground">Show the FAQ link in the footer.</p>
            </div>
            <Checkbox
              id="showFaq"
              checked={pages.showFaq}
              onCheckedChange={(v) => mutation.mutate({ pages: { showFaq: Boolean(v) } })}
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="showPolicies" className="text-base">Policy Pages</Label>
              <p className="text-sm text-muted-foreground">Show Privacy, Terms, and Shipping links.</p>
            </div>
            <Checkbox
              id="showPolicies"
              checked={pages.showPolicies}
              onCheckedChange={(v) => mutation.mutate({ pages: { showPolicies: Boolean(v) } })}
              disabled={mutation.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

