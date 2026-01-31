import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter shipping details and place your order.",
};

export default function CheckoutPage() {
  return (
    <Container className="py-10">
      <CheckoutClient />
    </Container>
  );
}
