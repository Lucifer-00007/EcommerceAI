"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const links = [
  { href: routes.accountProfile, label: "Profile", icon: User },
  { href: routes.accountOrders, label: "Orders", icon: Package },
  { href: "/account/saved-items", label: "Saved Items", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

