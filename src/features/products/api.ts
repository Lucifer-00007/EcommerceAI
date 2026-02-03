import { z } from "zod";

import { fetchJson } from "@/lib/api-client";
import { getAvailableColors, getAvailableSizes } from "@/features/clothes/utils";
import { categories, products, reviews } from "@/services/mock/db";
import {
  categorySchema,
  paginatedResultSchema,
  productSchema,
  reviewSchema,
} from "@/types/ecommerce";

export const categoriesResponseSchema = z.array(categorySchema);

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;

export const productsResponseSchema = paginatedResultSchema(productSchema);

export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export const productDetailResponseSchema = z.object({
  product: productSchema,
  reviews: z.array(reviewSchema),
});

export type ProductDetailResponse = z.infer<typeof productDetailResponseSchema>;

export type ProductsQuery = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  ratingMin?: number;
  colors?: string[];
  sizes?: string[];
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "rating_desc";
  page?: number;
  pageSize?: number;
};

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type SortKey = "relevance" | "newest" | "price_asc" | "price_desc" | "rating_desc";

export async function getCategories() {
  if (isStaticExport) {
    return categoriesResponseSchema.parse(categories);
  }
  return fetchJson("/api/categories", undefined, categoriesResponseSchema);
}

export async function getProducts(query: ProductsQuery) {
  if (isStaticExport) {
    const categoryId = query.category
      ? categories.find((c) => c.slug === query.category)?.id
      : undefined;

    const pageSize = clamp(query.pageSize ?? 12, 6, 48);
    const page = clamp(query.page ?? 1, 1, 10_000);

    let filtered = products.slice();

    if (categoryId) filtered = filtered.filter((p) => p.categoryId === categoryId);

    const minPrice = typeof query.minPrice === "number" ? query.minPrice : undefined;
    const maxPrice = typeof query.maxPrice === "number" ? query.maxPrice : undefined;
    const ratingMin = typeof query.ratingMin === "number" ? query.ratingMin : undefined;

    if (typeof minPrice === "number") {
      filtered = filtered.filter((p) => p.price.amount >= minPrice);
    }
    if (typeof maxPrice === "number") {
      filtered = filtered.filter((p) => p.price.amount <= maxPrice);
    }
    if (typeof ratingMin === "number") {
      filtered = filtered.filter((p) => p.rating >= ratingMin);
    }

    if (query.colors?.length) {
      filtered = filtered.filter((p) => {
        if (p.categoryId !== "cat_apparel") return false;
        const available = getAvailableColors(p);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return query.colors?.some((c) => available.has(c as any));
      });
    }

    if (query.sizes?.length) {
      filtered = filtered.filter((p) => {
        if (p.categoryId !== "cat_apparel") return false;
        const available = getAvailableSizes(p);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return query.sizes?.some((s) => available.has(s as any));
      });
    }

    if (query.q) {
      const qLower = query.q.toLowerCase();
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

    const sort: SortKey = query.sort ?? "relevance";
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
        if (query.q) filtered.sort(byRatingDesc);
        else filtered.sort(byNewest);
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = clamp(page, 1, totalPages);

    const start = (safePage - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return productsResponseSchema.parse({
      items,
      page: safePage,
      pageSize,
      total,
      totalPages,
    });
  }

  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (typeof query.minPrice === "number") params.set("minPrice", String(query.minPrice));
  if (typeof query.maxPrice === "number") params.set("maxPrice", String(query.maxPrice));
  if (typeof query.ratingMin === "number") params.set("ratingMin", String(query.ratingMin));
  if (query.colors?.length) params.set("colors", query.colors.join(","));
  if (query.sizes?.length) params.set("sizes", query.sizes.join(","));
  if (query.sort) params.set("sort", query.sort);
  if (typeof query.page === "number") params.set("page", String(query.page));
  if (typeof query.pageSize === "number") params.set("pageSize", String(query.pageSize));

  const url = params.size ? `/api/products?${params.toString()}` : "/api/products";
  return fetchJson(url, undefined, productsResponseSchema);
}

export async function getProductDetail(slug: string) {
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    throw new Error("Product not found");
  }

  const productReviews = reviews.filter((review) => review.productId === product.id);

  return productDetailResponseSchema.parse({
    product,
    reviews: productReviews,
  });
}
