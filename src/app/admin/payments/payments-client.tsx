"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Search, 
  Filter,
  MoreHorizontal,
  RefreshCw,
  AlertCircle
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminSettings, updateAdminSettings } from "@/features/admin/api";
import { formatPrice } from "@/utils/format";

// Mock Transaction Data
const transactions = [
  { id: "tx_1", customer: "Olivia Martin", email: "olivia@example.com", amount: 1999.00, status: "completed", date: "2024-03-12", method: "Visa •••• 4242" },
  { id: "tx_2", customer: "Jackson Lee", email: "jackson@example.com", amount: 39.00, status: "completed", date: "2024-03-12", method: "PayPal" },
  { id: "tx_3", customer: "Isabella Nguyen", email: "isabella@example.com", amount: 299.00, status: "pending", date: "2024-03-11", method: "Mastercard •••• 8888" },
  { id: "tx_4", customer: "William Kim", email: "will@example.com", amount: 99.00, status: "completed", date: "2024-03-11", method: "Visa •••• 1234" },
  { id: "tx_5", customer: "Sofia Davis", email: "sofia@example.com", amount: 39.00, status: "failed", date: "2024-03-10", method: "Visa •••• 5678" },
  { id: "tx_6", customer: "Ethan Hunt", email: "ethan@example.com", amount: 550.00, status: "refunded", date: "2024-03-09", method: "Amex •••• 9000" },
];

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
      toast.success("Payment settings saved");
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-sm text-muted-foreground">
            Monitor transactions, manage refunds, and configure payment gateways.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" /> +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" /> +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2%</div>
                <p className="text-xs text-muted-foreground flex items-center text-red-600">
                  <ArrowDownRight className="mr-1 h-3 w-3" /> +0.4% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <ArrowDownRight className="mr-1 h-3 w-3" /> -2 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Transaction ID</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Method</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-6 align-middle font-medium">{tx.id}</td>
                        <td className="p-6 align-middle">
                          <Badge variant={
                            tx.status === "completed" ? "default" :
                            tx.status === "pending" ? "secondary" :
                            tx.status === "failed" ? "destructive" : "outline"
                          } className="capitalize">
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="p-6 align-middle text-muted-foreground">{tx.method}</td>
                        <td className="p-6 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{tx.customer}</span>
                            <span className="text-xs text-muted-foreground">{tx.email}</span>
                          </div>
                        </td>
                        <td className="p-6 align-middle text-right font-medium">
                          {formatPrice(tx.amount, "USD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
           <Card>
            <CardHeader className="space-y-4 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="h-9 w-[250px] pl-9"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-9 border-dashed">
                    <Filter className="mr-2 h-4 w-4" />
                    Status
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Transaction ID</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-6 align-middle font-medium">{tx.id}</td>
                        <td className="p-6 align-middle text-muted-foreground">{tx.date}</td>
                        <td className="p-6 align-middle">
                          <Badge variant={
                            tx.status === "completed" ? "default" :
                            tx.status === "pending" ? "secondary" :
                            tx.status === "failed" ? "destructive" : "outline"
                          } className="capitalize">
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="p-6 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{tx.customer}</span>
                            <span className="text-xs text-muted-foreground">{tx.email}</span>
                          </div>
                        </td>
                        <td className="p-6 align-middle text-right font-medium">
                          {formatPrice(tx.amount, "USD")}
                        </td>
                        <td className="p-6 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Refund Payment</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure how you accept payments on your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label>Payment Provider</Label>
                <Select
                  value={payments.provider}
                  onValueChange={(value) => mutation.mutate({ payments: { provider: value } })}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Disabled (Test Mode)</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {payments.provider === "stripe" && (
                <div className="rounded-lg border p-4 bg-muted/50 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-[#635BFF]" />
                    <h3 className="font-semibold">Stripe Settings</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stripePublishableKey"
                        defaultValue={payments.stripePublishableKey ?? ""}
                        placeholder="pk_live_..."
                        className="font-mono"
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.parentElement?.querySelector("input")) as HTMLInputElement;
                          mutation.mutate({ payments: { stripePublishableKey: input?.value ?? "" } });
                        }}
                        disabled={mutation.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {payments.provider === "paypal" && (
                <div className="rounded-lg border p-4 bg-muted/50 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded-full bg-[#003087] flex items-center justify-center text-white text-[10px] font-bold">P</div>
                    <h3 className="font-semibold">PayPal Settings</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypalClientId">Client ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="paypalClientId"
                        defaultValue={payments.paypalClientId ?? ""}
                        placeholder="client_id_..."
                        className="font-mono"
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.parentElement?.querySelector("input")) as HTMLInputElement;
                          mutation.mutate({ payments: { paypalClientId: input?.value ?? "" } });
                        }}
                        disabled={mutation.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

