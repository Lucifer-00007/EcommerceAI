import { NextResponse, type NextRequest } from "next/server";

import { categories, products } from "@/services/mock/db";

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
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  const categorySlug = (url.searchParams.get("category") ?? "").trim();
  const categoryId = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.id
    : undefined;

  const minPrice = toNumber(url.searchParams.get("minPrice"));
  const maxPrice = toNumber(url.searchParams.get("maxPrice"));
  const ratingMin = toNumber(url.searchParams.get("ratingMin"));
  const sort = toSortKey(url.searchParams.get("sort"));

  const pageSize = clamp(toNumber(url.searchParams.get("pageSize")) ?? 12, 6, 48);
  const page = clamp(toNumber(url.searchParams.get("page")) ?? 1, 1, 10_000);

  let filtered = products.slice();

  if (categoryId) filtered = filtered.filter((p) => p.categoryId === categoryId);

  if (typeof minPrice === "number")
    filtered = filtered.filter((p) => p.price.amount >= minPrice);
  if (typeof maxPrice === "number")
    filtered = filtered.filter((p) => p.price.amount <= maxPrice);
  if (typeof ratingMin === "number")
    filtered = filtered.filter((p) => p.rating >= ratingMin);

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

