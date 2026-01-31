import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { ClothesClient } from "@/app/clothes/clothes-client";

export const metadata: Metadata = {
  title: "Clothes",
  description: "Browse all clothing items with filters and sorting.",
};

export default function ClothesPage() {
  return (
    <Container className="max-w-[1440px] px-6 py-6">
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ClothesClient />
      </Suspense>
    </Container>
  );
}

