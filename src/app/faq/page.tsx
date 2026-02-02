import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/common/reveal";

import { FaqClient } from "./faq-client";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary/20 pt-16 relative overflow-hidden">
        <Container>
          <div className="mx-auto max-w-2xl text-center relative z-10">
            <Reveal>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                How can we <span className="text-primary">help?</span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Search our knowledge base or browse frequently asked questions below.
              </p>
            </Reveal>
          </div>
        </Container>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <FaqClient />
        </Container>
      </section>
    </div>
  );
}

