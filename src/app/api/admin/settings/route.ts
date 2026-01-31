import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getAdminUserFromRequest } from "@/app/api/_lib/require-admin";
import { getSiteSettings, updateSiteSettings } from "@/services/admin/settings-store";

const settingsPatchSchema = z.object({
  payments: z
    .object({
      provider: z.enum(["none", "stripe", "paypal"]).optional(),
      stripePublishableKey: z.string().optional(),
      paypalClientId: z.string().optional(),
    })
    .optional(),
  social: z
    .object({
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      x: z.string().url().optional(),
      tiktok: z.string().url().optional(),
      youtube: z.string().url().optional(),
    })
    .optional(),
  pages: z
    .object({
      showAbout: z.boolean().optional(),
      showContact: z.boolean().optional(),
      showFaq: z.boolean().optional(),
      showPolicies: z.boolean().optional(),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ settings: getSiteSettings() });
}

export async function PATCH(request: NextRequest) {
  const user = getAdminUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = settingsPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const settings = updateSiteSettings(parsed.data);
  return NextResponse.json({ settings });
}

