import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <Container className="py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={routes.home}>Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={routes.products}>Browse products</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

