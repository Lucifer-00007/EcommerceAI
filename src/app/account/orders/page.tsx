import type { Metadata } from "next";

import { OrdersClient } from "./orders-client";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your recent orders.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
