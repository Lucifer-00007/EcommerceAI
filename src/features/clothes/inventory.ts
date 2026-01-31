import type { ClothColor, ClothSize } from "@/features/clothes/utils";

export type ClothVariantKey = {
  productId: string;
  size: ClothSize;
  color: ClothColor["key"];
};

const storageKey = "ecommerceai:inventory:v1";

function keyToString(key: ClothVariantKey) {
  return `${key.productId}:${key.size}:${key.color}`;
}

function hashString(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getInitialInventory(key: ClothVariantKey) {
  const h = hashString(keyToString(key));
  const base = (h % 13) + 1;
  const bias = key.size === "XL" ? -4 : key.size === "XS" ? -1 : 0;
  const next = Math.max(0, base + bias);
  return next;
}

export function readInventory(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, number> = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([k, v]) => {
      if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    });
    return out;
  } catch {
    return {};
  }
}

export function writeInventory(snapshot: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {}
}

export function getInventoryCount(key: ClothVariantKey) {
  const snapshot = readInventory();
  const k = keyToString(key);
  const stored = snapshot[k];
  if (typeof stored === "number") return stored;
  return getInitialInventory(key);
}

export function setInventoryCount(key: ClothVariantKey, count: number) {
  const snapshot = readInventory();
  const k = keyToString(key);
  snapshot[k] = Math.max(0, Math.floor(count));
  writeInventory(snapshot);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("inventory:update", { detail: { key: k, count: snapshot[k] } }));
  }
  return snapshot[k];
}

export function decrementInventory(key: ClothVariantKey, quantity: number) {
  const current = getInventoryCount(key);
  const next = Math.max(0, current - Math.max(1, Math.floor(quantity)));
  return setInventoryCount(key, next);
}

export function subscribeInventory(onUpdate: (next: { key: string; count: number }) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as unknown;
    if (!detail || typeof detail !== "object") return;
    const d = detail as { key?: unknown; count?: unknown };
    if (typeof d.key === "string" && typeof d.count === "number") onUpdate({ key: d.key, count: d.count });
  };
  window.addEventListener("inventory:update", handler);
  return () => window.removeEventListener("inventory:update", handler);
}

