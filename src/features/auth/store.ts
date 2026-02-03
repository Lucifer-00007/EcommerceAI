"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";

import type { User } from "@/types/ecommerce";
import { users } from "@/services/mock/db";

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

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const createStaticToken = (userId: string) =>
  `static-${userId}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

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
          if (isStaticExport) {
            if (password.length < 6) {
              throw new Error("Password must be at least 6 characters");
            }

            const user =
              users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
              null;
            if (!user) {
              throw new Error("Invalid credentials");
            }

            const data = authResponseSchema.parse({
              token: createStaticToken(user.id),
              user,
            });
            set({ token: data.token, user: data.user });
            return;
          }

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
          if (isStaticExport) {
            if (password.length < 6) {
              throw new Error("Password must be at least 6 characters");
            }

            const user = {
              id: `u_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`,
              email,
              name,
            };

            const data = authResponseSchema.parse({
              token: createStaticToken(user.id),
              user,
            });
            set({ token: data.token, user: data.user });
            return;
          }

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
          if (isStaticExport) {
            set({ token: null, user: null });
            return;
          }

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
