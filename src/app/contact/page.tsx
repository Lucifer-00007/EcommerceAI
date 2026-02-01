import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/common/reveal";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact support or send a message.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary/20 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We&apos;d love to hear from you. Please fill out this form or reach out using the contact details below.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                  <p className="mt-2 text-muted-foreground">
                    Our friendly team is always here to chat.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="mt-1 text-muted-foreground">Our friendly team is here to help.</p>
                      <a href="mailto:hello@ecommerceai.com" className="mt-2 block font-medium text-primary hover:underline">
                        hello@ecommerceai.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="mt-1 text-muted-foreground">Come say hello at our office headquarters.</p>
                      <p className="mt-2 font-medium">
                        100 Smith Street<br />
                        Collingwood VIC 3066 AU
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="mt-1 text-muted-foreground">Mon-Fri from 8am to 5pm.</p>
                      <a href="tel:+15550000000" className="mt-2 block font-medium text-primary hover:underline">
                        +1 (555) 000-0000
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <ContactClient />
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}

