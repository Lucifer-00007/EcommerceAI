import { z } from "zod";

import { fetchJson } from "@/lib/api-client";
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

export async function getCategories() {
  return fetchJson("/api/categories", undefined, categoriesResponseSchema);
}

export async function getProducts(query: ProductsQuery) {
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
  return fetchJson(`/api/products/${encodeURIComponent(slug)}`, undefined, productDetailResponseSchema);
}

