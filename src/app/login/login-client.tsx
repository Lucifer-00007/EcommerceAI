"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { routes } from "@/lib/routes";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginClient() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@shop.local", password: "password" },
    mode: "onBlur",
  });

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-muted-foreground">Use the demo account or register a new one.</p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await login(values);
                toast.success("Signed in");
                router.push(routes.accountProfile);
              } catch (e) {
                toast.error((e as Error)?.message ?? "Login failed");
              }
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={loading || form.formState.isSubmitting}>
              Sign in
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <Link href={routes.register} className="text-foreground underline">
              Create an account
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

