"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
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
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        Subscribe
      </Button>
    </form>
  );
}

