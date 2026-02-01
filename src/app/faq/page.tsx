import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/common/reveal";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions.",
};

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "Is this a real store?",
        a: "No, this is a high-fidelity demo storefront designed to showcase modern e-commerce architecture, accessible UI patterns, and production-grade code practices using Next.js 14.",
      },
      {
        q: "What technologies are used?",
        a: "The stack includes Next.js (App Router), TypeScript, Tailwind CSS, Radix UI, React Hook Form, Zod, and TanStack Query.",
      },
    ],
  },
  {
    category: "Payment & Shipping",
    items: [
      {
        q: "Do you support international shipping?",
        a: "Since this is a demo, we don't ship physical products. However, the address form supports international formats and validation.",
      },
      {
        q: "Can I add a real payment gateway?",
        a: "Yes. The codebase is structured for real integrations. The admin console includes a payments settings page suitable for wiring to Stripe, PayPal, or Lemon Squeezy.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "Do you support dark mode?",
        a: "Absolutely. We use a token-based design system that supports system, light, and dark modes seamlessly.",
      },
      {
        q: "How do I reset my password?",
        a: "In this demo environment, authentication is simplified. You can create a new account or use the pre-configured demo credentials.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary/20 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                How can we <span className="text-primary">help?</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Search our knowledge base or browse frequently asked questions below.
              </p>
              <div className="relative mt-8">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for answers..." 
                  className="h-12 w-full rounded-full border-muted-foreground/20 bg-background pl-10 shadow-sm transition-all focus-visible:ring-primary"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12">
            {faqs.map((category, idx) => (
              <Reveal key={category.category} delay={idx * 0.1}>
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold tracking-tight">{category.category}</h2>
                  <Accordion type="single" className="w-full">
                    {category.items.map((item, i) => (
                      <AccordionItem key={i} value={`${category.category}-${i}`}>
                        <AccordionTrigger className="text-left text-base font-medium">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            ))}

            <div className="mt-16 rounded-2xl border bg-secondary/10 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Still have questions?</h3>
              <p className="mt-2 text-muted-foreground">
                Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
              </p>
              <div className="mt-6">
                <Button asChild size="lg">
                  <Link href={routes.contact}>Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

