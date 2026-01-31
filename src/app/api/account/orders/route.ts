import { NextResponse, type NextRequest } from "next/server";

import { getSessionTokenFromRequest } from "@/app/api/_lib/auth";
import { getUserBySessionToken, orders } from "@/services/mock/db";

export async function GET(request: NextRequest) {
  const token = getSessionTokenFromRequest(request);
  const user = getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userOrders = orders.filter((o) => o.userId === user.id);
  return NextResponse.json({ orders: userOrders });
}

