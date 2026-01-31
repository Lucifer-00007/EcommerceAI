import type { Metadata } from "next";

import { AdminProductsClient } from "./products-client";

export const metadata: Metadata = {
  title: "Admin products",
  description: "Manage products in the admin console.",
};

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}

