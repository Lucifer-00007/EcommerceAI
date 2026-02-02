import Link from "next/link";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function SavedItemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Saved Items</h2>
          <p className="text-sm text-muted-foreground">
            Products you&apos;ve saved for later.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Heart className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Save items you love to revisit them later.
        </p>
        <Button asChild>
          <Link href={routes.products}>Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
