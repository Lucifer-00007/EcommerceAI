import type { Metadata } from "next";

import { AdminSocialClient } from "./social-client";

export const metadata: Metadata = {
  title: "Admin social",
  description: "Configure social links for the storefront.",
};

export default function AdminSocialPage() {
  return <AdminSocialClient />;
}

