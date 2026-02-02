import { NextResponse, type NextRequest } from "next/server";

import { getAdminUserFromRequest } from "@/app/api/_lib/require-admin";
import { orders } from "@/services/mock/db";

export async function GET(request: NextRequest) {
  const admin = getAdminUserFromRequest(request);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // In a real app, we would implement pagination and filtering here
  return NextResponse.json({ orders });
}
