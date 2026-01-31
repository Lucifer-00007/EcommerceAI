import { describe, expect, it } from "vitest";

import { getInitialInventory, getInventoryCount } from "@/features/clothes/inventory";

describe("clothes inventory", () => {
  it("produces deterministic initial inventory", () => {
    const key = { productId: "p_hoodie_1", size: "M" as const, color: "slate" as const };
    const a = getInitialInventory(key);
    const b = getInitialInventory(key);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
  });

  it("returns initial inventory when storage is unavailable", () => {
    const key = { productId: "p_hoodie_1", size: "L" as const, color: "navy" as const };
    const expected = getInitialInventory(key);
    expect(getInventoryCount(key)).toBe(expected);
  });
});

