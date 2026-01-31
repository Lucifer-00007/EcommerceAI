import type { NextRequest } from "next/server";

export function getSessionTokenFromRequest(request: NextRequest) {
  const cookieToken = request.cookies.get("session")?.value;
  if (cookieToken) return cookieToken;

  const authorization = request.headers.get("authorization");
  if (!authorization) return undefined;

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return undefined;
  return token || undefined;
}

