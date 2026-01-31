import type { User } from "@/types/ecommerce";

export function isAdminUser(user: Pick<User, "email"> | null | undefined) {
  return user?.email.toLowerCase() === "demo@shop.local";
}

