"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { createAdminProduct, deleteAdminProduct, getAdminProducts, updateAdminProduct } from "@/features/admin/api";
import { getCategories } from "@/features/products/api";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  priceAmount: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().min(1).default("USD"),
  imageSrc: z.string().min(1, "Image URL is required"),
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

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

  const items = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

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
    mode: "onChange",
  });

  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const imageSrc = useWatch({ control: form.control, name: "imageSrc" });
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
      toast.success(editing ? "Product updated successfully" : "Product created successfully");
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

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const toggleAll = () => {
    if (selectedProducts.size === items.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(items.map((p) => p.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Copy className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9" onClick={() => setEditing(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
                className="space-y-6 py-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" {...form.register("name")} placeholder="e.g. Classic T-Shirt" />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="slug">Slug (Optional)</Label>
                    <Input id="slug" {...form.register("slug")} placeholder="e.g. classic-t-shirt" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select
                      value={categoryId}
                      onValueChange={(v) => form.setValue("categoryId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceAmount">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="priceAmount"
                        type="number"
                        step="0.01"
                        className="pl-7"
                        {...form.register("priceAmount")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      placeholder="Product description..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="imageSrc">Image URL</Label>
                    <div className="flex gap-4">
                      <Input
                        id="imageSrc"
                        {...form.register("imageSrc")}
                        placeholder="/products/..."
                      />
                      {imageSrc && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border">
                          <ImageWithFallback src={imageSrc} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <Checkbox
                      id="featured"
                      checked={featured}
                      onCheckedChange={(c) => form.setValue("featured", Boolean(c))}
                    />
                    <Label htmlFor="featured" className="font-normal">
                      Feature this product on the homepage
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={saveMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : editing ? "Update Product" : "Create Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="h-9 w-[250px] pl-9 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 border-dashed rounded-lg">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            {selectedProducts.size > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground">
                  {selectedProducts.size} selected
                </span>
                <Button variant="destructive" size="sm" className="h-9 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading inventory...
            </div>
          ) : isError ? (
            <EmptyState
              title="Failed to load products"
              description={String((error as Error)?.message ?? "Please try again later.")}
              action={
                <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "products"] })}>
                  Retry
                </Button>
              }
            />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground w-[40px]">
                      <Checkbox
                        checked={selectedProducts.size === items.length && items.length > 0}
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                      />
                    </th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground w-[80px]">Image</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Category</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Price</th>
                    <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {items.map((p) => (
                    <tr
                      key={p.id}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                        selectedProducts.has(p.id) && "bg-muted/50"
                      )}
                    >
                      <td className="p-6 align-middle">
                        <Checkbox
                          checked={selectedProducts.has(p.id)}
                          onCheckedChange={() => toggleSelection(p.id)}
                          aria-label={`Select ${p.name}`}
                        />
                      </td>
                      <td className="p-6 align-middle">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                          <ImageWithFallback src={p.images[0].src} alt={p.images[0].alt} fill className="object-cover" sizes="40px" />
                        </div>
                      </td>
                      <td className="p-6 align-middle font-medium">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline-block">
                            {p.slug}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        {p.featured ? (
                          <Badge variant="default" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/20">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </td>
                      <td className="p-6 align-middle text-muted-foreground">
                        <Badge variant="outline" className="font-normal">
                          {categoriesById.get(p.categoryId) ?? p.categoryId}
                        </Badge>
                      </td>
                      <td className="p-6 align-middle font-medium">
                        {formatPrice(p.price.amount, p.price.currency)}
                      </td>
                      <td className="p-6 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditing(p);
                                setOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(p.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteMutation.mutate(p.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
