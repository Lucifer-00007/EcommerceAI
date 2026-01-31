import { z } from "zod";

import { fetchJson } from "@/lib/api-client";
import { orderSchema, userSchema } from "@/types/ecommerce";

export const profileResponseSchema = z.object({ user: userSchema });
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export const ordersResponseSchema = z.object({ orders: z.array(orderSchema) });
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

export async function getProfile() {
  return fetchJson("/api/account/profile", undefined, profileResponseSchema);
}

export async function getOrders() {
  return fetchJson("/api/account/orders", undefined, ordersResponseSchema);
}

