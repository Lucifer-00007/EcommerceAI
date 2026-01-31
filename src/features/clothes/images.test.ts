import { describe, expect, it } from "vitest";

import type { Product } from "@/types/ecommerce";
import { getClothImages } from "@/features/clothes/images";

function product(partial: Partial<Product>): Product {
  return {
    id: "p_test",
    slug: "cloud-hoodie",
    name: "Cloud Hoodie",
    description: "Test",
    price: { amount: 64, currency: "USD" },
    rating: 4.8,
    reviewCount: 10,
    categoryId: "cat_apparel",
    images: [{ src: "/products/cloud-hoodie.svg", alt: "Cloud Hoodie" }],
    featured: true,
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

describe("clothes images", () => {
  it("returns mapped images for known apparel slugs", () => {
    const imgs = getClothImages(product({ slug: "cloud-hoodie" }));
    expect(imgs.length).toBeGreaterThanOrEqual(1);
    expect(imgs[0]?.src.startsWith("https://")).toBe(true);
  });

  it("falls back to product images for unknown slugs", () => {
    const imgs = getClothImages(product({ slug: "unknown-slug" }));
    expect(imgs.length).toBeGreaterThanOrEqual(1);
    expect(imgs[0]?.src).toBe("/products/cloud-hoodie.svg");
  });
});

