import { describe, expect, it } from "vitest";

import type { Product } from "@/types/ecommerce";
import {
  buildClothesFacets,
  clothColors,
  clothSizes,
  clothTypes,
  deriveClothType,
  getAvailableColors,
  getAvailableSizes,
} from "@/features/clothes/utils";

function product(partial: Partial<Product>): Product {
  return {
    id: "p_test",
    slug: "test",
    name: "Test",
    description: "Test",
    price: { amount: 10, currency: "USD" },
    rating: 4.2,
    reviewCount: 10,
    categoryId: "cat_apparel",
    images: [{ src: "/products/everyday-tee.svg", alt: "Test" }],
    featured: false,
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

describe("clothes utils", () => {
  it("derives stable cloth type", () => {
    expect(deriveClothType(product({ slug: "cloud-hoodie", name: "Cloud Hoodie" }))).toBe("Hoodies");
    expect(deriveClothType(product({ slug: "ultra-jacket", name: "Ultra Jacket" }))).toBe("Jackets");
    expect(deriveClothType(product({ slug: "everyday-tee", name: "Everyday Tee" }))).toBe("T-Shirts");
  });

  it("builds facets with all keys present", () => {
    const items = [
      product({ slug: "everyday-tee", name: "Everyday Tee" }),
      product({ slug: "cloud-hoodie", name: "Cloud Hoodie" }),
      product({ slug: "ultra-jacket", name: "Ultra Jacket" }),
    ];
    const facets = buildClothesFacets(items);
    clothTypes.forEach((t) => expect(typeof facets[t]).toBe("number"));
    expect(facets["T-Shirts"]).toBeGreaterThan(0);
    expect(facets["Hoodies"]).toBeGreaterThan(0);
    expect(facets["Jackets"]).toBeGreaterThan(0);
  });

  it("always enables at least three sizes and includes M", () => {
    const sizes = getAvailableSizes(product({ slug: "any" }));
    expect(sizes.has("M")).toBe(true);
    expect(sizes.size).toBeGreaterThanOrEqual(3);
    clothSizes.forEach((s) => {
      if (sizes.has(s)) expect(s).toBeTruthy();
    });
  });

  it("always enables at least one color", () => {
    const colors = getAvailableColors(product({ slug: "any" }));
    expect(colors.size).toBeGreaterThanOrEqual(1);
    const valid = new Set(clothColors.map((c) => c.key));
    colors.forEach((c) => expect(valid.has(c)).toBe(true));
  });
});

