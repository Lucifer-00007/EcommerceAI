import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CartClient } from "./cart-client";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <Container className="py-10">
      <CartClient />
    </Container>
  );
}
