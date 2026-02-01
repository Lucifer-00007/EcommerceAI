import type { Metadata } from "next";
import Link from "next/link";
import { Check, Github, Globe, Layers, ShieldCheck, Zap } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/common/reveal";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about EcommerceAI.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-secondary/20 py-20 lg:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Building the future of <span className="text-primary">digital commerce</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                EcommerceAI is a modern storefront demo focused on production-grade UI/UX patterns:
                typed APIs, defensive states, accessible components, and a clean information
                architecture.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href={routes.products}>Browse Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background">
                  <Link href={routes.contact}>Get in Touch</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Core Principles</h2>
            <p className="mt-4 text-muted-foreground">Built on a foundation of modern web standards.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Reveal delay={0.1}>
              <Card className="h-full border-none shadow-none bg-secondary/10">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Fast to Iterate</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Feature-based structure with reusable UI building blocks designed for rapid development cycles.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card className="h-full border-none shadow-none bg-secondary/10">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Type-Safe</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    End-to-end type safety with Zod validation for API contracts and strict TypeScript checks.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.3}>
              <Card className="h-full border-none shadow-none bg-secondary/10">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Layers className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Themeable UI</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Token-based design system supporting automatic light and dark mode switching.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Components", value: "40+" },
              { label: "API Routes", value: "12" },
              { label: "Performance", value: "100" },
              { label: "Accessibility", value: "AA" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team/Story Section */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted lg:aspect-[4/3]">
                {/* Placeholder for team/office image */}
                <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground">
                  <Globe className="h-24 w-24 opacity-20" />
                </div>
              </div>
            </Reveal>
            <div className="space-y-8">
              <Reveal delay={0.2}>
                <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  We believe that building a high-quality commerce experience shouldn&apos;t require reinventing the wheel. 
                  EcommerceAI provides a solid foundation of best practices, allowing developers to focus on what makes their brand unique.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Open source and community driven",
                    "Performance first architecture",
                    "Modern developer experience",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" /> View on GitHub
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

