import { NextResponse, type NextRequest } from "next/server";

import { reviews } from "@/services/mock/db";
import { getCatalogProducts } from "@/services/admin/catalog-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getCatalogProducts().find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);

  return NextResponse.json({ product, reviews: productReviews });
}
