"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";

import type { User } from "@/types/ecommerce";

const authResponseSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    id: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1),
  }),
});

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; name: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hydrated: false,
      token: null,
      user: null,
      loading: false,
      login: async ({ email, password }) => {
        set({ loading: true });
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const json = await response.json().catch(() => null);
          if (!response.ok) {
            const message =
              typeof (json as { message?: unknown } | null)?.message === "string"
                ? (json as { message: string }).message
                : "Login failed";
            throw new Error(message);
          }
          const data = authResponseSchema.parse(json);
          set({ token: data.token, user: data.user });
        } finally {
          set({ loading: false });
        }
      },
      register: async ({ email, name, password }) => {
        set({ loading: true });
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password }),
          });
          const json = await response.json().catch(() => null);
          if (!response.ok) {
            const message =
              typeof (json as { message?: unknown } | null)?.message === "string"
                ? (json as { message: string }).message
                : "Registration failed";
            throw new Error(message);
          }
          const data = authResponseSchema.parse(json);
          set({ token: data.token, user: data.user });
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ loading: true });
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          set({ token: null, user: null });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
