import type { Metadata } from "next";
import { Book, Scale, ScrollText } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for EcommerceAI.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary/20 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center relative">
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Please read these terms carefully before using our services.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-16">
            <Reveal delay={0.1}>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ScrollText className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Agreement to Terms</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and EcommerceAI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of the website.
                    </p>
                    <p className="text-sm italic bg-secondary/30 p-4 rounded-lg border">
                      <strong>Disclaimer:</strong> EcommerceAI is a demonstration project. No real commercial transactions, services, or binding legal agreements are intended or implied by the use of this software.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="h-px bg-border" />

            <Reveal delay={0.2}>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Scale className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Intellectual Property Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="h-px bg-border" />

            <Reveal delay={0.3}>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Book className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">User Representations</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}

