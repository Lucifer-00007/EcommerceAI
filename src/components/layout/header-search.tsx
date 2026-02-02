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
      className={cn("relative w-full", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        router.push(`${routes.products}${params.toString() ? `?${params.toString()}` : ""}`);
      }}
    >
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full pl-9 bg-background"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
