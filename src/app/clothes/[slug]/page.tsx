import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { getCatalogProducts } from "@/services/admin/catalog-store";
import { ClothDetailClient } from "./cloth-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProducts().find((p) => p.slug === slug && p.categoryId === "cat_apparel");
  if (!product) return { title: "Cloth not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, type: "website" },
  };
}

export default async function ClothDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = getCatalogProducts();
  const product = all.find((p) => p.slug === slug && p.categoryId === "cat_apparel");
  if (!product) notFound();

  const related = all
    .filter((p) => p.categoryId === "cat_apparel" && p.id !== product.id)
    .slice(0, 4);

  return (
    <Container className="max-w-[1280px] px-4 py-6 md:px-8">
      <ClothDetailClient product={product} related={related} />
    </Container>
  );
}
