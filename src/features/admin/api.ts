import { z } from "zod";

import { fetchJson } from "@/lib/api-client";
import {
  createAdminProduct as createAdminProductLocal,
  deleteAdminProduct as deleteAdminProductLocal,
  getAdminProducts as getAdminProductsLocal,
  updateAdminProduct as updateAdminProductLocal,
} from "@/services/admin/catalog-store";
import { getSiteSettings, updateSiteSettings } from "@/services/admin/settings-store";
import { orders } from "@/services/mock/db";
import { productSchema, orderSchema } from "@/types/ecommerce";

export const adminProductsResponseSchema = z.object({
  items: z.array(productSchema),
});
export type AdminProductsResponse = z.infer<typeof adminProductsResponseSchema>;

export const adminProductResponseSchema = z.object({
  product: productSchema,
});
export type AdminProductResponse = z.infer<typeof adminProductResponseSchema>;

export const adminOrderResponseSchema = z.object({
  order: orderSchema,
});
export type AdminOrderResponse = z.infer<typeof adminOrderResponseSchema>;

export const adminOrdersResponseSchema = z.object({
  orders: z.array(orderSchema),
});
export type AdminOrdersResponse = z.infer<typeof adminOrdersResponseSchema>;

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

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export async function getAdminProducts() {
  if (isStaticExport) {
    return adminProductsResponseSchema.parse({ items: getAdminProductsLocal() });
  }
  return fetchJson("/api/admin/products", undefined, adminProductsResponseSchema);
}

export async function createAdminProduct(payload: z.input<typeof productSchema>) {
  const createPayload = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    categoryId: payload.categoryId,
    price: {
      amount: payload.price.amount,
      currency: payload.price.currency ?? "USD",
    },
    rating: payload.rating ?? 0,
    reviewCount: payload.reviewCount ?? 0,
    images: payload.images,
    featured: payload.featured ?? false,
  };

  if (isStaticExport) {
    return adminProductResponseSchema.parse({
      product: createAdminProductLocal(createPayload),
    });
  }

  return fetchJson(
    "/api/admin/products",
    { method: "POST", body: JSON.stringify(createPayload) },
    adminProductResponseSchema,
  );
}

export async function updateAdminProduct(id: string, patch: Record<string, unknown>) {
  if (isStaticExport) {
    const updated = updateAdminProductLocal(id, patch as Parameters<typeof updateAdminProductLocal>[1]);
    if (!updated) {
      throw new Error("Not found");
    }
    return adminProductResponseSchema.parse({ product: updated });
  }

  return fetchJson(
    "/api/admin/products",
    { method: "PATCH", body: JSON.stringify({ id, ...patch }) },
    adminProductResponseSchema,
  );
}

export async function deleteAdminProduct(id: string) {
  if (isStaticExport) {
    deleteAdminProductLocal(id);
    return { ok: true };
  }

  return fetchJson(
    "/api/admin/products",
    { method: "DELETE", body: JSON.stringify({ id }) },
    z.object({ ok: z.boolean() }),
  );
}

export async function getAdminSettings() {
  if (isStaticExport) {
    return adminSettingsResponseSchema.parse({ settings: getSiteSettings() });
  }
  return fetchJson("/api/admin/settings", undefined, adminSettingsResponseSchema);
}

export async function updateAdminSettings(patch: Record<string, unknown>) {
  if (isStaticExport) {
    return adminSettingsResponseSchema.parse({
      settings: updateSiteSettings(patch as Parameters<typeof updateSiteSettings>[0]),
    });
  }

  return fetchJson(
    "/api/admin/settings",
    { method: "PATCH", body: JSON.stringify(patch) },
    adminSettingsResponseSchema,
  );
}

export async function getAdminOrder(orderId: string) {
  const { orders: adminOrders } = await getAdminOrders();
  const order = adminOrders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return adminOrderResponseSchema.parse({ order });
}

export async function getAdminOrders() {
  if (isStaticExport) {
    return adminOrdersResponseSchema.parse({ orders });
  }
  return fetchJson("/api/admin/orders", undefined, adminOrdersResponseSchema);
}
