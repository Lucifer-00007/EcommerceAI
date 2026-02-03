import { z } from "zod";

import { fetchJson } from "@/lib/api-client";
import { orderSchema, userSchema } from "@/types/ecommerce";

export const profileResponseSchema = z.object({ user: userSchema });
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export const ordersResponseSchema = z.object({ orders: z.array(orderSchema) });
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

export const orderResponseSchema = z.object({ order: orderSchema });
export type OrderResponse = z.infer<typeof orderResponseSchema>;

export async function getProfile() {
  return fetchJson("/api/account/profile", undefined, profileResponseSchema);
}

export async function getOrders() {
  return fetchJson("/api/account/orders", undefined, ordersResponseSchema);
}

export async function getOrder(orderId: string) {
  const { orders } = await getOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return orderResponseSchema.parse({ order });
}
