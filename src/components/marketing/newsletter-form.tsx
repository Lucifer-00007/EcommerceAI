"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className={cn("mx-auto flex w-full max-w-md gap-x-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await new Promise((r) => setTimeout(r, 300));
          toast.success("Subscribed");
          setEmail("");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-10 rounded-lg border-0 bg-card px-3.5 shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
      />
      <Button type="submit" disabled={loading} className="h-10 rounded-lg px-3.5">
        Subscribe
      </Button>
    </form>
  );
}
