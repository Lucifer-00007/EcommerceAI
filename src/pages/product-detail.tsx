import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id;
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
    enabled: !!productId,
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["/api/products", productId, "reviews"],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}/reviews`);
      return res.json();
    },
    enabled: !!productId,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const isInWishlist = wishlist?.some((item: any) => item.id === Number(productId));

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        await apiRequest("DELETE", `/api/wishlist/${productId}`);
      } else {
        await apiRequest("POST", "/api/wishlist", { productId: Number(productId) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/products/${productId}/reviews`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", productId, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", productId] });
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      toast({ title: "Review submitted!" });
    },
    onError: () => {
      toast({ title: "Failed to submit review", variant: "destructive" });
    },
  });

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name}`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          {discount > 0 && (
            <Badge className="absolute top-4 left-4" variant="destructive">
              -{discount}% OFF
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(Number(product.rating || 0))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{Number(product.rating || 0).toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1">
                {product.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                data-testid="button-decrease-qty"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center" data-testid="text-quantity">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="button-increase-qty"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            {user && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => wishlistMutation.mutate()}
                data-testid="button-wishlist"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
            )}
          </div>

          {product.stock > 0 && product.stock < 10 && (
            <Badge variant="secondary">Only {product.stock} left in stock</Badge>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs">Free Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs">Secure Payment</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingReviews ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : reviews?.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews?.map((review: any) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {review.user?.name || review.user?.username}
                      </span>
                    </div>
                    {review.title && (
                      <p className="font-medium">{review.title}</p>
                    )}
                    {review.comment && (
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  reviewMutation.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        data-testid={`button-rating-${i + 1}`}
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer ${
                            i < reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-title">Title (optional)</Label>
                  <Input
                    id="review-title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summary of your review"
                    data-testid="input-review-title"
                  />
                </div>
                <div>
                  <Label htmlFor="review-comment">Review</Label>
                  <Textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this product"
                    rows={4}
                    data-testid="input-review-comment"
                  />
                </div>
                <Button type="submit" disabled={reviewMutation.isPending} data-testid="button-submit-review">
                  {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
