import { NextResponse } from "next/server";

import { categories } from "@/services/mock/db";

export async function GET() {
  return NextResponse.json(categories);
}

