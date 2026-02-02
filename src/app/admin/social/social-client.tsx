"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  MessageCircle, 
  BarChart2, 
  Users, 
  TrendingUp,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      toast.success("Social settings saved");
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

  const platforms = [
    { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600", placeholder: "https://instagram.com/..." },
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", placeholder: "https://facebook.com/..." },
    { key: "x", label: "X (Twitter)", icon: Twitter, color: "text-black", placeholder: "https://x.com/..." },
    { key: "tiktok", label: "TikTok", icon: MessageCircle, color: "text-black", placeholder: "https://tiktok.com/@..." },
    { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", placeholder: "https://youtube.com/..." },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media</h2>
          <p className="text-sm text-muted-foreground">
            Manage your social presence, analytics, and connected accounts.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5k</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" /> +5.2% this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8%</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" /> +0.8% this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+12 new posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reach</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85.2k</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" /> +12.5% this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest interactions across your platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { user: "alex_designs", action: "commented on your post", platform: "Instagram", time: "2m ago" },
                  { user: "sarah.smith", action: "retweeted your tweet", platform: "X", time: "15m ago" },
                  { user: "mike_vlogs", action: "mentioned you in a story", platform: "Instagram", time: "1h ago" },
                  { user: "jessica_doe", action: "shared your post", platform: "Facebook", time: "3h ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`} />
                      <AvatarFallback>{activity.user[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.platform} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Status of your social media integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {platforms.map((platform) => {
                  const isConnected = !!social[platform.key as keyof typeof social];
                  const Icon = platform.icon;
                  return (
                    <div key={platform.key} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-muted ${platform.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{platform.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {isConnected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button variant={isConnected ? "outline" : "default"} size="sm">
                        {isConnected ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Profile Links</CardTitle>
              <CardDescription>These URLs will be displayed in your storefront footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.key} className="space-y-2">
                    <Label htmlFor={platform.key} className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${platform.color}`} />
                      {platform.label}
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id={platform.key} 
                        defaultValue={social[platform.key as keyof typeof social] ?? ""} 
                        placeholder={platform.placeholder} 
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          const input = (e.currentTarget.parentElement?.querySelector("input")) as HTMLInputElement;
                          mutation.mutate({ social: { [platform.key]: input?.value ?? "" } });
                        }}
                        disabled={mutation.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
