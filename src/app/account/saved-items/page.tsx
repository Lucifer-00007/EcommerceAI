import { EmptyState } from "@/components/common/empty-state";

export default function SavedItemsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Saved Items</h2>
      <EmptyState
        title="Your wishlist is empty"
        description="Save items you love to revisit them later."
      />
    </div>
  );
}
