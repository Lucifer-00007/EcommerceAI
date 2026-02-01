import type { Metadata } from "next";
import { Cookie, Lock, Shield } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for EcommerceAI.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary/20 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center relative">
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We value your privacy and are committed to protecting your personal data.
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
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Data Collection</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
                    </p>
                    <p className="text-sm italic bg-secondary/30 p-4 rounded-lg border">
                      <strong>Demo Note:</strong> This application uses mocked data services. No real credit card or sensitive personal information is stored or processed securely as would be required in a production environment.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="h-px bg-border" />

            <Reveal delay={0.2}>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Security Measures</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="h-px bg-border" />

            <Reveal delay={0.3}>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cookie className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Cookies & Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
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

