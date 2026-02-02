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
      <section className="py-24 lg:py-32 bg-secondary/5">
        <Container>
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Core Principles</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We built EcommerceAI on a foundation of modern web standards, ensuring scalability, maintainability, and a superior developer experience.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Reveal delay={0.1}>
              <Card className="h-full border border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-background/50 backdrop-blur-sm group">
                <CardContent className="flex flex-col items-center p-10 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Zap className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Fast to Iterate</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Feature-based structure with reusable UI building blocks designed for rapid development cycles.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card className="h-full border border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-background/50 backdrop-blur-sm group">
                <CardContent className="flex flex-col items-center p-10 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Type-Safe</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    End-to-end type safety with Zod validation for API contracts and strict TypeScript checks.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.3}>
              <Card className="h-full border border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-background/50 backdrop-blur-sm group">
                <CardContent className="flex flex-col items-center p-10 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Layers className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Themeable UI</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Token-based design system supporting automatic light and dark mode switching.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-background py-20">
        <Container>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {[
              { label: "Components", value: "40+" },
              { label: "API Routes", value: "12" },
              { label: "Performance", value: "100" },
              { label: "Accessibility", value: "AA" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight">{stat.value}</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team/Story Section */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted lg:aspect-[4/3] shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                   <div className="text-center p-6">
                      <Globe className="h-32 w-32 mx-auto mb-4 text-primary/40" />
                      <p className="font-medium text-lg text-foreground/60">Global Headquarters</p>
                   </div>
                </div>
              </div>
            </Reveal>
            <div className="space-y-10">
              <Reveal delay={0.2}>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  We believe that building a high-quality commerce experience shouldn&apos;t require reinventing the wheel. 
                  EcommerceAI provides a solid foundation of best practices, allowing developers to focus on what makes their brand unique.
                </p>
                <ul className="mt-10 space-y-5">
                  {[
                    "Open source and community driven",
                    "Performance first architecture",
                    "Modern developer experience",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-8">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all">
                    <Github className="h-5 w-5" /> View on GitHub
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

