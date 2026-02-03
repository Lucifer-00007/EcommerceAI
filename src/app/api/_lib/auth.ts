import type { NextRequest } from "next/server";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function getSessionTokenFromRequest(request: NextRequest) {
  if (isStaticExport) return undefined;

  const cookieToken = request.cookies.get("session")?.value;
  if (cookieToken) return cookieToken;

  const authorization = request.headers.get("authorization");
  if (!authorization) return undefined;

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return undefined;
  return token || undefined;
}
