import type { User } from "@/types/ecommerce";

export function isAdminUser(user: Pick<User, "email"> | null | undefined) {
  if (!user?.email) return false;
  const email = user.email.toLowerCase();
  return email === "demo@shop.local" || email === "admin@shop.local";
}