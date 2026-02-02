"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, MapPin, MoreVertical, Pencil, Trash2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { shippingAddressSchema } from "@/types/ecommerce";
import { EmptyState } from "@/components/common/empty-state";

// Extend schema for form usage
const addressFormSchema = shippingAddressSchema.extend({
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressItem extends AddressFormValues {
  id: string;
}

// Mock initial data
const initialAddresses: AddressItem[] = [
  {
    id: "addr_1",
    fullName: "Demo User",
    email: "demo@shop.local",
    phone: "+1 (555) 123-4567",
    address1: "123 Market St",
    city: "San Francisco",
    region: "CA",
    postalCode: "94105",
    country: "US",
    isDefault: true,
  },
];

export function AddressesClient() {
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      region: "",
      postalCode: "",
      country: "US",
      isDefault: false,
    },
  });

  const onSubmit = (values: AddressFormValues) => {
    // Force isDefault to boolean in case it's undefined (though zod handles this)
    const safeValues = { ...values, isDefault: Boolean(values.isDefault) };
    
    if (editingId) {
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingId) {
            return { ...safeValues, id: editingId };
          }
          if (safeValues.isDefault && addr.isDefault) {
             return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
      toast.success("Address updated");
    } else {
      const newId = `addr_${Date.now()}`;
      if (safeValues.isDefault) {
         setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
      }
      setAddresses((prev) => [...prev, { ...safeValues, id: newId }]);
      toast.success("Address added");
    }
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const handleEdit = (address: AddressItem) => {
    setEditingId(address.id);
    form.reset(address);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address deleted");
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  const openNewDialog = () => {
    setEditingId(null);
    form.reset({
      fullName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      region: "",
      postalCode: "",
      country: "US",
      isDefault: addresses.length === 0, // Auto-default if first
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Address Book</h2>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Address
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update your existing shipping details."
                : "Add a new address for faster checkout."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...form.register("fullName")} placeholder="John Doe" />
                {form.formState.errors.fullName && (
                  <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} placeholder="+1 (555) 000-0000" />
                {form.formState.errors.phone && (
                  <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...form.register("country")} />
                {form.formState.errors.country && (
                  <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" {...form.register("address1")} placeholder="123 Street Name" />
                {form.formState.errors.address1 && (
                  <p className="text-xs text-destructive">{form.formState.errors.address1.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input id="address2" {...form.register("address2")} placeholder="Apt, Suite, Unit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} />
                {form.formState.errors.city && (
                  <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">State / Region</Label>
                <Input id="region" {...form.register("region")} />
                {form.formState.errors.region && (
                  <p className="text-xs text-destructive">{form.formState.errors.region.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...form.register("postalCode")} />
                {form.formState.errors.postalCode && (
                  <p className="text-xs text-destructive">{form.formState.errors.postalCode.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Address</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {addresses.length === 0 ? (
        <EmptyState
          title="No addresses saved"
          description="Add an address to speed up checkout."
          action={
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {addresses.map((address) => (
            <Card key={address.id} className="relative group overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {address.fullName}
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-[10px] h-5 font-normal">
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">{address.email}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(address)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    {!address.isDefault && (
                      <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                        <Check className="mr-2 h-4 w-4" /> Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>{address.address1}</p>
                    {address.address2 && <p>{address.address2}</p>}
                    <p>
                      {address.city}, {address.region} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>
                <div className="text-muted-foreground pl-6 text-xs">
                  {address.phone}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}