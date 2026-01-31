import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createSessionForUser, users } from "@/services/mock/db";

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const payload = registerSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json(
      { message: "Invalid registration payload" },
      { status: 400 },
    );
  }

  const emailLower = payload.data.email.toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === emailLower);
  if (existing) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }

  const user = {
    id: `u_${users.length + 1}`,
    email: payload.data.email,
    name: payload.data.name,
  };
  users.push(user);

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

