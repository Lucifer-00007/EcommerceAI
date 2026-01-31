import { Container } from "@/components/layout/container";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function Loading() {
  return (
    <Container className="max-w-[1440px] px-6 py-6">
      <ProductGridSkeleton count={12} />
    </Container>
  );
}

