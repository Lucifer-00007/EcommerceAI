"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminSettings, updateAdminSettings } from "@/features/admin/api";

export function AdminSocialClient() {
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

  if (!data) return <EmptyState title="No settings" description="Try refreshing." />;
  const { social } = data.settings;

  function renderRow(key: keyof typeof social, label: string, placeholder: string) {
    return (
      <div className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        <div className="flex gap-2">
          <Input id={key} defaultValue={social[key] ?? ""} placeholder={placeholder} />
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              const input = (e.currentTarget.parentElement?.querySelector("input") ??
                null) as HTMLInputElement | null;
              mutation.mutate({ social: { [key]: input?.value ?? "" } });
            }}
            disabled={mutation.isPending}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Social</h2>
        <p className="text-sm text-muted-foreground">Set social profile URLs for the footer.</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {renderRow("instagram", "Instagram", "https://instagram.com/your-brand")}
          {renderRow("facebook", "Facebook", "https://facebook.com/your-brand")}
          {renderRow("x", "X (Twitter)", "https://x.com/your-brand")}
          {renderRow("tiktok", "TikTok", "https://tiktok.com/@your-brand")}
          {renderRow("youtube", "YouTube", "https://youtube.com/@your-brand")}
        </CardContent>
      </Card>
    </div>
  );
}
