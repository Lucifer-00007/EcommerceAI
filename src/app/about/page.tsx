import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about EcommerceAI.",
};

export default function AboutPage() {
  return (
    <Container className="py-10">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">About</h1>
          <p className="text-muted-foreground">
            EcommerceAI is a modern storefront demo focused on production-grade UI/UX patterns:
            typed APIs, defensive states, accessible components, and a clean information
            architecture.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">Fast to iterate</p>
              <p className="text-sm text-muted-foreground">
                Feature-based structure with reusable UI building blocks.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">Typed from end to end</p>
              <p className="text-sm text-muted-foreground">
                Zod validation for API contracts and strict TypeScript.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">Themeable UI</p>
              <p className="text-sm text-muted-foreground">
                Token-based design with system/light/dark modes.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={routes.products}>Browse products</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={routes.contact}>Contact</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

