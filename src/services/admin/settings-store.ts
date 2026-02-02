export type PaymentProvider = "none" | "stripe" | "paypal";

export type SiteSettings = {
  payments: {
    provider: PaymentProvider;
    stripePublishableKey?: string;
    paypalClientId?: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    x?: string;
    tiktok?: string;
    youtube?: string;
  };
  pages: {
    showAbout: boolean;
    showContact: boolean;
    showFaq: boolean;
    showPolicies: boolean;
  };
};

export type SiteSettingsPatch = {
  payments?: Partial<SiteSettings["payments"]>;
  social?: Partial<SiteSettings["social"]>;
  pages?: Partial<SiteSettings["pages"]>;
};

const defaultSettings: SiteSettings = {
  payments: { provider: "none" },
  social: {},
  pages: { showAbout: true, showContact: true, showFaq: true, showPolicies: true },
};

// Use globalThis to persist settings across hot reloads
function getState() {
  const g = globalThis as unknown as { __ecommerceAiSettings?: SiteSettings };
  if (!g.__ecommerceAiSettings) g.__ecommerceAiSettings = defaultSettings;
  return g.__ecommerceAiSettings;
}

export function getSiteSettings() {
  return getState();
}

export function updateSiteSettings(patch: SiteSettingsPatch) {
  const current = getState();
  const next: SiteSettings = {
    payments: { ...current.payments, ...patch.payments },
    social: { ...current.social, ...patch.social },
    pages: { ...current.pages, ...patch.pages },
  };
  const g = globalThis as unknown as { __ecommerceAiSettings?: SiteSettings };
  g.__ecommerceAiSettings = next;
  return next;
}
