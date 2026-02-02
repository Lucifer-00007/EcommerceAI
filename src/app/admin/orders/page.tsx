import type { Metadata } from "next";

import { AdminOrdersClient } from "./admin-orders-client";

export const metadata: Metadata = {
  title: "Admin orders",
  description: "View orders in the admin console.",
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
