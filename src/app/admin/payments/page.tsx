import type { Metadata } from "next";

import { AdminPaymentsClient } from "./payments-client";

export const metadata: Metadata = {
  title: "Admin payments",
  description: "Configure payment provider settings.",
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsClient />;
}

