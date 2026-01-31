import type { Product } from "@/types/ecommerce";

export type ClothSize = "XS" | "S" | "M" | "L" | "XL";

export const clothSizes: ClothSize[] = ["XS", "S", "M", "L", "XL"];

export type ClothType = "T-Shirts" | "Hoodies" | "Pants" | "Jackets";

export const clothTypes: ClothType[] = ["T-Shirts", "Hoodies", "Pants", "Jackets"];

export type ClothColor = {
  key: "slate" | "navy" | "olive";
  name: string;
  value: string;
};

export const clothColors: ClothColor[] = [
  { key: "slate", name: "Slate", value: "#334155" },
  { key: "navy", name: "Navy Blue", value: "#1e3a8a" },
  { key: "olive", name: "Olive Green", value: "#3f6212" },
];

export function deriveClothType(product: Product): ClothType {
  const s = `${product.slug} ${product.name}`.toLowerCase();
  if (s.includes("hoodie")) return "Hoodies";
  if (s.includes("jacket")) return "Jackets";
  if (s.includes("tee") || s.includes("t-shirt") || s.includes("shirt")) return "T-Shirts";
  return "Pants";
}

function hashString(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getAvailableSizes(product: Product): Set<ClothSize> {
  const h = hashString(product.slug);
  const enabled = new Set<ClothSize>();
  clothSizes.forEach((size, index) => {
    const bit = (h >>> index) & 1;
    if (bit || size === "M") enabled.add(size);
  });
  if (enabled.size < 3) {
    enabled.add("S");
    enabled.add("L");
  }
  return enabled;
}

export function getAvailableColors(product: Product): Set<ClothColor["key"]> {
  const h = hashString(product.slug);
  const enabled = new Set<ClothColor["key"]>();
  clothColors.forEach((c, index) => {
    const bit = (h >>> (index + 5)) & 1;
    if (bit) enabled.add(c.key);
  });
  if (enabled.size === 0) enabled.add("slate");
  return enabled;
}

export type ClothesFacets = Record<ClothType, number>;

export function buildClothesFacets(items: Product[]): ClothesFacets {
  const base: ClothesFacets = {
    "T-Shirts": 0,
    Hoodies: 0,
    Pants: 0,
    Jackets: 0,
  };
  items.forEach((p) => {
    base[deriveClothType(p)] += 1;
  });
  return base;
}

