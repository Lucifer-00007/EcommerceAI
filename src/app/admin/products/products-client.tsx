"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAdminProduct, deleteAdminProduct, getAdminProducts, updateAdminProduct } from "@/features/admin/api";
import { getCategories } from "@/features/products/api";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

const productFormSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  priceAmount: z.coerce.number().nonnegative(),
  currency: z.string().min(1).default("USD"),
  imageSrc: z.string().min(1),
  featured: z.boolean().default(false),
});

type ProductFormValues = z.input<typeof productFormSchema>;

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    priceAmount: product.price.amount,
    currency: product.price.currency,
    imageSrc: product.images[0]?.src ?? "",
    featured: product.featured,
  };
}

export function AdminProductsClient() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => getAdminProducts(),
  });

  const categoriesById = useMemo(() => {
    const map = new Map<string, string>();
    (categoriesData ?? []).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categoriesData]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: categoriesData?.[0]?.id ?? "",
      priceAmount: 0,
      currency: "USD",
      imageSrc: "/products/everyday-tee.svg",
      featured: false,
    },
    values: editing ? toFormValues(editing) : undefined,
    mode: "onBlur",
  });

  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const imageSrc = useWatch({ control: form.control, name: "imageSrc" });
  const name = useWatch({ control: form.control, name: "name" });
  const featured = useWatch({ control: form.control, name: "featured" });

  const saveMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const parsed = productFormSchema.parse(values);
      const payload = {
        id: editing?.id ?? "temp",
        slug: parsed.slug?.trim() || "",
        name: parsed.name,
        description: parsed.description,
        categoryId: parsed.categoryId,
        price: { amount: parsed.priceAmount, currency: parsed.currency },
        rating: editing?.rating ?? 0,
        reviewCount: editing?.reviewCount ?? 0,
        images: [{ src: parsed.imageSrc, alt: parsed.name }],
        featured: parsed.featured,
        createdAt: editing?.createdAt ?? new Date().toISOString(),
      } as Product;

      if (editing) {
        return updateAdminProduct(editing.id, {
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          categoryId: payload.categoryId,
          price: payload.price,
          images: payload.images,
          featured: payload.featured,
        });
      }

      return createAdminProduct(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editing ? "Product updated" : "Product created");
      setOpen(false);
      setEditing(null);
      form.reset();
    },
    onError: (e) => toast.error((e as Error)?.message ?? "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteAdminProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (e) => toast.error((e as Error)?.message ?? "Delete failed"),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">Create, edit, and delete catalog items.</p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => {
                setEditing(null);
                form.reset();
                setOpen(true);
              }}
            >
              New product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(async (values) => saveMutation.mutateAsync(values))}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name ? (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" {...form.register("slug")} placeholder="auto-generated if empty" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} {...form.register("description")} />
                {form.formState.errors.description ? (
                  <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => form.setValue("categoryId", value, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categoriesData ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId ? (
                    <p className="text-xs text-destructive">{form.formState.errors.categoryId.message}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="priceAmount">Price</Label>
                    <Input id="priceAmount" type="number" inputMode="decimal" {...form.register("priceAmount")} />
                    {form.formState.errors.priceAmount ? (
                      <p className="text-xs text-destructive">{form.formState.errors.priceAmount.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" {...form.register("currency")} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="imageSrc">Image URL</Label>
                  <Input id="imageSrc" {...form.register("imageSrc")} />
                  {form.formState.errors.imageSrc ? (
                    <p className="text-xs text-destructive">{form.formState.errors.imageSrc.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={imageSrc || "/products/everyday-tee.svg"}
                      alt={name || "Preview"}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={featured}
                  onCheckedChange={(v) => form.setValue("featured", Boolean(v))}
                  id="featured"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading products…</p>
          </CardContent>
        </Card>
      ) : isError ? (
        <EmptyState title="Failed to load admin products" description={String((error as Error)?.message ?? "")} />
      ) : items.length ? (
        <div className="space-y-3">
          {items.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    <Image src={p.images[0].src} alt={p.images[0].alt} fill className="object-cover" sizes="64px" />
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {categoriesById.get(p.categoryId) ?? p.categoryId} • {formatPrice(p.price.amount, p.price.currency)}
                      {p.featured ? " • Featured" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditing(p);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(p.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No products" description="Create your first product to populate the catalog." />
      )}
    </div>
  );
}
