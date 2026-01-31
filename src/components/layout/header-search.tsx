"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

export function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      className={cn("w-full", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        router.push(`${routes.products}${params.toString() ? `?${params.toString()}` : ""}`);
      }}
    >
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for products…"
          className="h-10 rounded-lg border-0 bg-secondary pl-9 pr-4 shadow-sm ring-1 ring-inset ring-border focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
    </form>
  );
}
