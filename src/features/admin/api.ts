import { z } from "zod";

import { fetchJson } from "@/lib/api-client";
import { productSchema } from "@/types/ecommerce";

export const adminProductsResponseSchema = z.object({
  items: z.array(productSchema),
});
export type AdminProductsResponse = z.infer<typeof adminProductsResponseSchema>;

export const adminProductResponseSchema = z.object({
  product: productSchema,
});
export type AdminProductResponse = z.infer<typeof adminProductResponseSchema>;

export const siteSettingsSchema = z.object({
  payments: z.object({
    provider: z.enum(["none", "stripe", "paypal"]),
    stripePublishableKey: z.string().optional(),
    paypalClientId: z.string().optional(),
  }),
  social: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    x: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
  }),
  pages: z.object({
    showAbout: z.boolean(),
    showContact: z.boolean(),
    showFaq: z.boolean(),
    showPolicies: z.boolean(),
  }),
});

export const adminSettingsResponseSchema = z.object({
  settings: siteSettingsSchema,
});
export type AdminSettingsResponse = z.infer<typeof adminSettingsResponseSchema>;

export async function getAdminProducts() {
  return fetchJson("/api/admin/products", undefined, adminProductsResponseSchema);
}

export async function createAdminProduct(payload: z.input<typeof productSchema>) {
  const createPayload = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    categoryId: payload.categoryId,
    price: payload.price,
    rating: payload.rating,
    reviewCount: payload.reviewCount,
    images: payload.images,
    featured: payload.featured,
  };

  return fetchJson("/api/admin/products", { method: "POST", body: JSON.stringify(createPayload) }, adminProductResponseSchema);
}

export async function updateAdminProduct(id: string, patch: Record<string, unknown>) {
  return fetchJson(`/api/admin/products/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) }, adminProductResponseSchema);
}

export async function deleteAdminProduct(id: string) {
  return fetchJson(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }, z.object({ ok: z.boolean() }));
}

export async function getAdminSettings() {
  return fetchJson("/api/admin/settings", undefined, adminSettingsResponseSchema);
}

export async function updateAdminSettings(patch: Record<string, unknown>) {
  return fetchJson("/api/admin/settings", { method: "PATCH", body: JSON.stringify(patch) }, adminSettingsResponseSchema);
}

