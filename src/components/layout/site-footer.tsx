import Link from "next/link";

import { Container } from "@/components/layout/container";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} EcommerceAI</p>
        <div className="flex items-center gap-4">
          <Link href={routes.products} className="hover:text-foreground">
            Products
          </Link>
          <Link href={routes.cart} className="hover:text-foreground">
            Cart
          </Link>
        </div>
      </Container>
    </footer>
  );
}

