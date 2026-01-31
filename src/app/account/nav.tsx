"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function AccountNav() {
  const pathname = usePathname();

  const items = [
    { href: routes.accountProfile, label: "Profile" },
    { href: routes.accountOrders, label: "Orders" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Button
            key={item.href}
            asChild
            variant={active ? "default" : "secondary"}
            className={cn(active ? "" : "text-muted-foreground")}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}

