import { randomUUID } from "crypto";

import type { Category, Order, Product, Review, User } from "@/types/ecommerce";

export const categories: Category[] = [
  {
    id: "cat_apparel",
    slug: "apparel",
    name: "Apparel",
    imageSrc: "/products/category-apparel.svg",
  },
  {
    id: "cat_accessories",
    slug: "accessories",
    name: "Accessories",
    imageSrc: "/products/category-accessories.svg",
  },
  {
    id: "cat_home",
    slug: "home",
    name: "Home",
    imageSrc: "/products/category-home.svg",
  },
  {
    id: "cat_electronics",
    slug: "electronics",
    name: "Electronics",
    imageSrc: "/products/category-electronics.svg",
  },
];

const nowIso = new Date().toISOString();

export const products: Product[] = [
  {
    id: "p_tee_1",
    slug: "everyday-tee",
    name: "Everyday Tee",
    description:
      "A soft, durable t-shirt designed for daily wear with a relaxed fit.",
    price: { amount: 24, currency: "USD" },
    rating: 4.6,
    reviewCount: 128,
    categoryId: "cat_apparel",
    images: [{ src: "/products/everyday-tee.svg", alt: "Everyday Tee" }],
    featured: true,
    createdAt: nowIso,
  },
  {
    id: "p_hoodie_1",
    slug: "cloud-hoodie",
    name: "Cloud Hoodie",
    description:
      "Heavyweight fleece hoodie with a premium feel and clean silhouette.",
    price: { amount: 64, currency: "USD" },
    rating: 4.8,
    reviewCount: 94,
    categoryId: "cat_apparel",
    images: [{ src: "/products/cloud-hoodie.svg", alt: "Cloud Hoodie" }],
    featured: true,
    createdAt: nowIso,
  },
  {
    id: "p_mug_1",
    slug: "ceramic-mug",
    name: "Ceramic Mug",
    description: "Minimal ceramic mug with a comfortable handle and matte glaze.",
    price: { amount: 18, currency: "USD" },
    rating: 4.3,
    reviewCount: 41,
    categoryId: "cat_home",
    images: [{ src: "/products/ceramic-mug.svg", alt: "Ceramic Mug" }],
    featured: false,
    createdAt: nowIso,
  },
  {
    id: "p_bag_1",
    slug: "canvas-tote",
    name: "Canvas Tote",
    description:
      "Everyday carry tote with reinforced straps and an internal pocket.",
    price: { amount: 32, currency: "USD" },
    rating: 4.5,
    reviewCount: 57,
    categoryId: "cat_accessories",
    images: [{ src: "/products/canvas-tote.svg", alt: "Canvas Tote" }],
    featured: false,
    createdAt: nowIso,
  },
  {
    id: "p_headphones_1",
    slug: "studio-headphones",
    name: "Studio Headphones",
    description:
      "Balanced sound with comfortable pads and low-latency wired listening.",
    price: { amount: 129, currency: "USD" },
    rating: 4.7,
    reviewCount: 203,
    categoryId: "cat_electronics",
    images: [{ src: "/products/studio-headphones.svg", alt: "Studio Headphones" }],
    featured: true,
    createdAt: nowIso,
  },
  {
    id: "p_charger_1",
    slug: "compact-charger",
    name: "Compact Charger",
    description:
      "Fast, travel-friendly charger with universal voltage support.",
    price: { amount: 39, currency: "USD" },
    rating: 4.4,
    reviewCount: 76,
    categoryId: "cat_electronics",
    images: [{ src: "/products/compact-charger.svg", alt: "Compact Charger" }],
    featured: false,
    createdAt: nowIso,
  },
  {
    id: "p_notebook_1",
    slug: "grid-notebook",
    name: "Grid Notebook",
    description: "Lay-flat notebook with grid pages for notes, sketches, and lists.",
    price: { amount: 14, currency: "USD" },
    rating: 4.2,
    reviewCount: 22,
    categoryId: "cat_accessories",
    images: [{ src: "/products/grid-notebook.svg", alt: "Grid Notebook" }],
    featured: false,
    createdAt: nowIso,
  },
  {
    id: "p_candle_1",
    slug: "woodland-candle",
    name: "Woodland Candle",
    description:
      "Clean-burning candle with warm notes of cedar and subtle citrus.",
    price: { amount: 28, currency: "USD" },
    rating: 4.6,
    reviewCount: 35,
    categoryId: "cat_home",
    images: [{ src: "/products/woodland-candle.svg", alt: "Woodland Candle" }],
    featured: false,
    createdAt: nowIso,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p_tee_1",
    authorName: "Alex",
    rating: 5,
    title: "Perfect everyday shirt",
    body: "Soft fabric and great fit. Ordered a second one right away.",
    createdAt: nowIso,
  },
  {
    id: "r2",
    productId: "p_tee_1",
    authorName: "Morgan",
    rating: 4,
    title: "Comfortable",
    body: "Nice and breathable. Runs slightly large, which I prefer.",
    createdAt: nowIso,
  },
  {
    id: "r3",
    productId: "p_headphones_1",
    authorName: "Jamie",
    rating: 5,
    title: "Great sound",
    body: "Balanced audio and comfortable for long sessions.",
    createdAt: nowIso,
  },
];

export const users: User[] = [
  { id: "u_1", email: "demo@shop.local", name: "Demo User" },
];

export const sessions = new Map<string, { userId: string; createdAt: string }>();

export function createSessionForUser(userId: string) {
  const token = randomUUID();
  sessions.set(token, { userId, createdAt: new Date().toISOString() });
  return token;
}

export function getUserBySessionToken(token: string | undefined) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  return users.find((u) => u.id === session.userId) ?? null;
}

export const orders: Order[] = [
  {
    id: "o_1001",
    userId: "u_1",
    items: [
      {
        productId: "p_hoodie_1",
        quantity: 1,
        unitPrice: { amount: 64, currency: "USD" },
      },
      {
        productId: "p_mug_1",
        quantity: 2,
        unitPrice: { amount: 18, currency: "USD" },
      },
    ],
    total: { amount: 100, currency: "USD" },
    status: "fulfilled",
    shippingAddress: {
      fullName: "Demo User",
      email: "demo@shop.local",
      phone: "555-0100",
      address1: "123 Market St",
      city: "San Francisco",
      region: "CA",
      postalCode: "94105",
      country: "US",
    },
    createdAt: nowIso,
  },
];

