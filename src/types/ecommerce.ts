import { z } from "zod";

export const moneySchema = z.object({
  amount: z.number().finite().nonnegative(),
  currency: z.string().min(3).max(3).default("USD"),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  imageSrc: z.string().min(1),
});

export type Category = z.infer<typeof categorySchema>;

export const productImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: moneySchema,
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  images: z.array(productImageSchema).min(1),
  featured: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export type Product = z.infer<typeof productSchema>;

export const reviewSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  authorName: z.string().min(1),
  rating: z.number().min(0).max(5),
  title: z.string().min(1),
  body: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof reviewSchema>;

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(3),
  country: z.string().min(2),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: moneySchema,
    }),
  ),
  total: moneySchema,
  status: orderStatusSchema,
  shippingAddress: shippingAddressSchema,
  createdAt: z.string().datetime(),
});

export type Order = z.infer<typeof orderSchema>;

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;

export const paginatedResultSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });

