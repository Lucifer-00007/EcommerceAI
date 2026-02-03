import type { Product } from "@/types/ecommerce";
import { products as baseProducts } from "@/services/mock/db";

const randomUUID = () =>
  globalThis.crypto?.randomUUID?.() ??
  `uuid_${Math.random().toString(16).slice(2)}`;

type CatalogState = {
  overridesById: Record<string, Product>;
  deletedIds: Set<string>;
};

function getState(): CatalogState {
  const g = globalThis as unknown as { __ecommerceAiCatalog?: CatalogState };
  if (!g.__ecommerceAiCatalog) {
    g.__ecommerceAiCatalog = { overridesById: {}, deletedIds: new Set() };
  }
  return g.__ecommerceAiCatalog;
}

export function getCatalogProducts(): Product[] {
  const state = getState();
  const merged: Product[] = [];

  for (const p of baseProducts) {
    if (state.deletedIds.has(p.id)) continue;
    merged.push(state.overridesById[p.id] ?? p);
  }

  for (const p of Object.values(state.overridesById)) {
    const existsInBase = baseProducts.some((bp) => bp.id === p.id);
    if (!existsInBase) merged.push(p);
  }

  return merged;
}

export function getAdminProducts(): Product[] {
  return getCatalogProducts();
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUniqueSlug(slugBase: string, taken: Set<string>) {
  if (!taken.has(slugBase)) return slugBase;
  let i = 2;
  while (taken.has(`${slugBase}-${i}`)) i += 1;
  return `${slugBase}-${i}`;
}

export function createAdminProduct(
  input: Omit<Product, "id" | "createdAt" | "slug"> & { slug?: string },
) {
  const state = getState();
  const all = getCatalogProducts();
  const takenSlugs = new Set(all.map((p) => p.slug));

  const rawSlug = input.slug?.trim() ? input.slug.trim() : slugify(input.name);
  const slug = ensureUniqueSlug(rawSlug || randomUUID(), takenSlugs);

  const nowIso = new Date().toISOString();
  const product: Product = {
    ...input,
    id: `p_${randomUUID()}`,
    slug,
    createdAt: nowIso,
  };

  state.overridesById[product.id] = product;
  return product;
}

export function updateAdminProduct(id: string, patch: Partial<Omit<Product, "id" | "createdAt">>) {
  const state = getState();
  const all = getCatalogProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return null;

  const next: Product = { ...existing, ...patch };
  state.deletedIds.delete(id);
  state.overridesById[id] = next;
  return next;
}

export function deleteAdminProduct(id: string) {
  const state = getState();
  state.deletedIds.add(id);
  delete state.overridesById[id];
}
