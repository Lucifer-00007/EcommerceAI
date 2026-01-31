import { Container } from "@/components/layout/container";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function Loading() {
  return (
    <Container className="py-10">
      <ProductGridSkeleton />
    </Container>
  );
}

