import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getAdminUserFromRequest } from "@/app/api/_lib/require-admin";
import { categories } from "@/services/mock/db";
import { deleteAdminProduct, updateAdminProduct } from "@/services/admin/catalog-store";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  price: z.object({ amount: z.number().nonnegative(), currency: z.string().min(1) }).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  images: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1) })).min(1).optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
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

  const updated = updateAdminProduct(id, parsed.data);
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ product: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  deleteAdminProduct(id);
  return NextResponse.json({ ok: true });
}

