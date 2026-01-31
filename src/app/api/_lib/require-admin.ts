import type { NextRequest } from "next/server";

import { getSessionTokenFromRequest } from "@/app/api/_lib/auth";
import { getUserBySessionToken } from "@/services/mock/db";
import { isAdminUser } from "@/features/auth/is-admin";

export function getAdminUserFromRequest(request: NextRequest) {
  const token = getSessionTokenFromRequest(request);
  const user = getUserBySessionToken(token);
  if (!user) return null;
  if (!isAdminUser(user)) return null;
  return user;
}

