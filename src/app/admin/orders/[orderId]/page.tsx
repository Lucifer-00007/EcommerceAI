import { orders } from "@/services/mock/db";
import { AdminOrderDetailsClient } from "./admin-order-details-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return orders.map((order) => ({ orderId: order.id }));
}

export default function AdminOrderDetailsPage() {
  return <AdminOrderDetailsClient />;
}
