import type { NextRequest } from "next/server";

import { getSessionTokenFromRequest } from "@/app/api/_lib/auth";
import { getUserBySessionToken, users } from "@/services/mock/db";
import { isAdminUser } from "@/features/auth/is-admin";

export function getAdminUserFromRequest(request: NextRequest) {
  const token = getSessionTokenFromRequest(request);
  const user = getUserBySessionToken(token);

  // Development bypass: if no valid session, default to demo admin
  if (!user && process.env.NODE_ENV === "development") {
    const demoUser = users.find((u) => u.email === "demo@shop.local");
    if (demoUser && isAdminUser(demoUser)) return demoUser;
  }

  if (!user) return null;
  if (!isAdminUser(user)) return null;
  return user;
}

