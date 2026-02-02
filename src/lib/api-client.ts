import { z } from "zod";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, options: { status: number; data?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.data = options.data;
  }
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      typeof (data as { message?: unknown } | null)?.message === "string"
        ? (data as { message: string }).message
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, { status: response.status, data });
  }

  return schema.parse(data);
}

