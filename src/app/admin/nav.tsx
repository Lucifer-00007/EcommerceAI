"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, FileText, LayoutDashboard, Package, Share2, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const links = [
  { href: routes.admin, label: "Overview", icon: LayoutDashboard },
  { href: routes.adminProducts, label: "Products", icon: Package },
  { href: routes.adminOrders, label: "Orders", icon: ShoppingCart },
  { href: routes.adminPages, label: "Pages", icon: FileText },
  { href: routes.adminPayments, label: "Payments", icon: CreditCard },
  { href: routes.adminSocial, label: "Social", icon: Share2 },
];

export function AdminNav({ className }: { className?: string }) {
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
