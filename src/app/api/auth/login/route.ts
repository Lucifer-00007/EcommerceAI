import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createSessionForUser, users } from "@/services/mock/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const payload = loginSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ message: "Invalid login payload" }, { status: 400 });
  }

  const user = users.find((u) => u.email.toLowerCase() === payload.data.email.toLowerCase());
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = createSessionForUser(user.id);

  const response = NextResponse.json({ token, user });
  response.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

