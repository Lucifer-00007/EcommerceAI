"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <Container className="py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link href={routes.home}>Go home</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
