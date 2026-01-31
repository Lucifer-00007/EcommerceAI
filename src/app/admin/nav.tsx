"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const links = [
  { href: routes.admin, label: "Overview" },
  { href: routes.adminProducts, label: "Products" },
  { href: routes.adminOrders, label: "Orders" },
  { href: routes.adminPages, label: "Pages" },
  { href: routes.adminPayments, label: "Payments" },
  { href: routes.adminSocial, label: "Social" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md border px-3 py-2 text-sm",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
