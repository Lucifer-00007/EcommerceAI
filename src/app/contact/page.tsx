import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact support or send a message.",
};

export default function ContactPage() {
  return (
    <Container className="py-10">
      <ContactClient />
    </Container>
  );
}

