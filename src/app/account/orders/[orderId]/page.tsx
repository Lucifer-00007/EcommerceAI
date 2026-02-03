import { orders } from "@/services/mock/db";
import { OrderDetailsClient } from "./order-details-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return orders.map((order) => ({ orderId: order.id }));
}

export default function OrderDetailsPage() {
  return <OrderDetailsClient />;
}
