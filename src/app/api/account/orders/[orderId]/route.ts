import { NextResponse, type NextRequest } from "next/server";

import { getSessionTokenFromRequest } from "@/app/api/_lib/auth";
import { getUserBySessionToken, orders, users } from "@/services/mock/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const token = getSessionTokenFromRequest(request);
  let user = getUserBySessionToken(token);

  // Development bypass
  if (!user && process.env.NODE_ENV === "development") {
    user = users.find((u) => u.email === "demo@shop.local") ?? null;
  }

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const order = orders.find((o) => o.id === orderId && o.userId === user?.id);

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}