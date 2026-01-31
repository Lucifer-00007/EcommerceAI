import type { Metadata } from "next";

import { AdminPagesClient } from "./pages-client";

export const metadata: Metadata = {
  title: "Admin pages",
  description: "Manage marketing pages visibility.",
};

export default function AdminPagesPage() {
  return <AdminPagesClient />;
}

