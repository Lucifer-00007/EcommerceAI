import { describe, expect, it, beforeEach } from "vitest";
import { useFavoritesStore } from "./store";

describe("useFavoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.getState().clear();
  });

  it("starts with empty items", () => {
    const state = useFavoritesStore.getState();
    expect(state.items).toEqual([]);
  });

  it("adds an item", () => {
    useFavoritesStore.getState().addItem("p_1");
    const state = useFavoritesStore.getState();
    expect(state.items).toEqual(["p_1"]);
  });

  it("does not add duplicate items", () => {
    useFavoritesStore.getState().addItem("p_1");
    useFavoritesStore.getState().addItem("p_1");
    const state = useFavoritesStore.getState();
    expect(state.items).toEqual(["p_1"]);
  });

  it("removes an item", () => {
    useFavoritesStore.getState().addItem("p_1");
    useFavoritesStore.getState().removeItem("p_1");
    const state = useFavoritesStore.getState();
    expect(state.items).toEqual([]);
  });

  it("toggles an item", () => {
    // Add
    useFavoritesStore.getState().toggleItem("p_1");
    expect(useFavoritesStore.getState().items).toEqual(["p_1"]);
    
    // Remove
    useFavoritesStore.getState().toggleItem("p_1");
    expect(useFavoritesStore.getState().items).toEqual([]);
  });

  it("clears all items", () => {
    useFavoritesStore.getState().addItem("p_1");
    useFavoritesStore.getState().addItem("p_2");
    useFavoritesStore.getState().clear();
    const state = useFavoritesStore.getState();
    expect(state.items).toEqual([]);
  });
});
