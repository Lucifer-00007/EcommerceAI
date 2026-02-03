import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getAdminUserFromRequest } from "@/app/api/_lib/require-admin";
import { categories } from "@/services/mock/db";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from "@/services/admin/catalog-store";

export const dynamic = "force-static";

const imageSchema = z.object({ src: z.string().min(1), alt: z.string().min(1) });

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.object({ amount: z.number().nonnegative(), currency: z.string().min(1) }),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  images: z.array(imageSchema).min(1),
  featured: z.boolean().default(false),
});

const updateProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  price: z.object({ amount: z.number().nonnegative(), currency: z.string().min(1) }).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  images: z.array(imageSchema).min(1).optional(),
  featured: z.boolean().optional(),
});

const deleteProductSchema = z.object({
  id: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ items: getAdminProducts() });
}

export async function POST(request: NextRequest) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = createProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const categoryExists = categories.some((c) => c.id === parsed.data.categoryId);
  if (!categoryExists) {
    return NextResponse.json({ message: "Invalid categoryId" }, { status: 400 });
  }

  const product = createAdminProduct(parsed.data);
  return NextResponse.json({ product }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = updateProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.categoryId) {
    const categoryExists = categories.some((c) => c.id === parsed.data.categoryId);
    if (!categoryExists) {
      return NextResponse.json({ message: "Invalid categoryId" }, { status: 400 });
    }
  }

  const { id, ...patch } = parsed.data;
  const updated = updateAdminProduct(id, patch);
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ product: updated });
}

export async function DELETE(request: NextRequest) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = deleteProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  deleteAdminProduct(parsed.data.id);
  return NextResponse.json({ ok: true });
}
