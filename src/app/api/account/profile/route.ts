import { NextResponse, type NextRequest } from "next/server";

import { getSessionTokenFromRequest } from "@/app/api/_lib/auth";
import { getUserBySessionToken, users } from "@/services/mock/db";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const token = getSessionTokenFromRequest(request);
  let user = getUserBySessionToken(token);

  // Development bypass: if no valid session, default to demo user
  if (!user && process.env.NODE_ENV === "development") {
    user = users.find((u) => u.email === "demo@shop.local") ?? null;
  }

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
