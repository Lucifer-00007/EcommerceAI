"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdminSettings, updateAdminSettings } from "@/features/admin/api";

export function AdminPaymentsClient() {
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

  const payments = data?.settings.payments;
  if (!payments) return <EmptyState title="No settings" description="Try refreshing." />;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Payments</h2>
        <p className="text-sm text-muted-foreground">
          Demo settings for wiring a payment gateway. Do not store secrets in the browser.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={payments.provider}
              onValueChange={(value) => mutation.mutate({ payments: { provider: value } })}
              disabled={mutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {payments.provider === "stripe" ? (
            <div className="space-y-2">
              <Label htmlFor="stripePublishableKey">Stripe publishable key</Label>
              <div className="flex gap-2">
                <Input
                  id="stripePublishableKey"
                  defaultValue={payments.stripePublishableKey ?? ""}
                  placeholder="pk_live_… or pk_test_…"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    const input = (e.currentTarget.parentElement?.querySelector(
                      "input",
                    ) ?? null) as HTMLInputElement | null;
                    mutation.mutate({ payments: { stripePublishableKey: input?.value ?? "" } });
                  }}
                  disabled={mutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : null}

          {payments.provider === "paypal" ? (
            <div className="space-y-2">
              <Label htmlFor="paypalClientId">PayPal client ID</Label>
              <div className="flex gap-2">
                <Input
                  id="paypalClientId"
                  defaultValue={payments.paypalClientId ?? ""}
                  placeholder="Client ID"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    const input = (e.currentTarget.parentElement?.querySelector(
                      "input",
                    ) ?? null) as HTMLInputElement | null;
                    mutation.mutate({ payments: { paypalClientId: input?.value ?? "" } });
                  }}
                  disabled={mutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

