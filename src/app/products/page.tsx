import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ProductsClient } from "./products-client";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse products with filters, sorting, and pagination.",
};

export default function ProductsPage() {
  return (
    <Container className="py-10">
      <ProductsClient />
    </Container>
  );
}
