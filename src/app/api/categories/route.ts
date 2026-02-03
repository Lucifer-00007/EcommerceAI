import { NextResponse } from "next/server";

import { categories } from "@/services/mock/db";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(categories);
}
