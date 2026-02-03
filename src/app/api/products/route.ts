import { NextResponse, type NextRequest } from "next/server";

import { categories } from "@/services/mock/db";
import { getCatalogProducts } from "@/services/admin/catalog-store";
import { getAvailableColors, getAvailableSizes } from "@/features/clothes/utils";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export const dynamic = "force-static";

function toNumber(value: string | null) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type SortKey = "relevance" | "newest" | "price_asc" | "price_desc" | "rating_desc";

function toSortKey(value: string | null): SortKey {
  switch (value) {
    case "newest":
    case "price_asc":
    case "price_desc":
    case "rating_desc":
      return value;
    default:
      return "relevance";
  }
}

export async function GET(request: NextRequest) {
  if (isStaticExport) {
    const products = getCatalogProducts();
    const total = products.length;
    const pageSize = 12;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const items = products
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, pageSize);

    return NextResponse.json({
      items,
      page: 1,
      pageSize,
      total,
      totalPages,
    });
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  const categorySlug = (url.searchParams.get("category") ?? "").trim();
  const categoryId = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.id
    : undefined;

  const minPrice = toNumber(url.searchParams.get("minPrice"));
  const maxPrice = toNumber(url.searchParams.get("maxPrice"));
  const ratingMin = toNumber(url.searchParams.get("ratingMin"));
  const colors = url.searchParams.get("colors")?.split(",").filter(Boolean);
  const sizes = url.searchParams.get("sizes")?.split(",").filter(Boolean);
  const sort = toSortKey(url.searchParams.get("sort"));

  const pageSize = clamp(toNumber(url.searchParams.get("pageSize")) ?? 12, 6, 48);
  const page = clamp(toNumber(url.searchParams.get("page")) ?? 1, 1, 10_000);

  const products = getCatalogProducts();
  let filtered = products.slice();

  if (categoryId) filtered = filtered.filter((p) => p.categoryId === categoryId);

  if (typeof minPrice === "number")
    filtered = filtered.filter((p) => p.price.amount >= minPrice);
  if (typeof maxPrice === "number")
    filtered = filtered.filter((p) => p.price.amount <= maxPrice);
  if (typeof ratingMin === "number")
    filtered = filtered.filter((p) => p.rating >= ratingMin);

  if (colors?.length) {
    filtered = filtered.filter((p) => {
      // Only apparel items have colors in our mock logic
      if (p.categoryId !== "cat_apparel") return false;
      const available = getAvailableColors(p);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return colors.some((c) => available.has(c as any));
    });
  }

  if (sizes?.length) {
    filtered = filtered.filter((p) => {
      // Only apparel items have sizes in our mock logic
      if (p.categoryId !== "cat_apparel") return false;
      const available = getAvailableSizes(p);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return sizes.some((s) => available.has(s as any));
    });
  }

  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower),
    );
  }

  const byNewest = (a: typeof products[number], b: typeof products[number]) =>
    b.createdAt.localeCompare(a.createdAt);

  const byPriceAsc = (a: typeof products[number], b: typeof products[number]) =>
    a.price.amount - b.price.amount;

  const byPriceDesc = (a: typeof products[number], b: typeof products[number]) =>
    b.price.amount - a.price.amount;

  const byRatingDesc = (a: typeof products[number], b: typeof products[number]) =>
    b.rating - a.rating;

  switch (sort) {
    case "newest":
      filtered.sort(byNewest);
      break;
    case "price_asc":
      filtered.sort(byPriceAsc);
      break;
    case "price_desc":
      filtered.sort(byPriceDesc);
      break;
    case "rating_desc":
      filtered.sort(byRatingDesc);
      break;
    default:
      if (q) filtered.sort(byRatingDesc);
      else filtered.sort(byNewest);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(page, 1, totalPages);

  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
  });
}
