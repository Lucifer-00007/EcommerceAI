"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Mail, Shield, LogOut } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/features/account/api";
import { useAuthStore } from "@/features/auth/store";
import { routes } from "@/lib/routes";

export function ProfileClient() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { data } = useQuery({
    queryKey: ["account", "profile"],
    queryFn: () => getProfile(),
    enabled: Boolean(user),
  });

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
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

  const profileData = data?.user ?? user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and security.
          </p>
        </div>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={async () => {
            try {
              await logout();
              toast.success("Signed out");
            } catch {
              toast.error("Sign out failed");
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your photo and personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email}`} />
                <AvatarFallback className="text-lg">
                  {profileData.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {profileData.email}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    defaultValue={profileData.name ?? ""} 
                    className="pl-9" 
                    readOnly 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={profileData.email ?? ""} 
                    className="pl-9" 
                    readOnly 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-xs text-muted-foreground">Receive updates about new products.</p>
                </div>
                {/* Placeholder switch - would need state */}
                <div className="h-6 w-11 rounded-full bg-muted border" /> 
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

