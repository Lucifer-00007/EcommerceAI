import { NextResponse, type NextRequest } from "next/server";

import { getAdminUserFromRequest } from "@/app/api/_lib/require-admin";
import { orders } from "@/services/mock/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const admin = getAdminUserFromRequest(request);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
