import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return (
    <Container className="py-10">
      <LoginClient />
    </Container>
  );
}
