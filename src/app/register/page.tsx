import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account.",
};

export default function RegisterPage() {
  return (
    <Container className="py-10">
      <RegisterClient />
    </Container>
  );
}
