import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    originalPrice?: string | null;
    image: string;
    rating?: string | null;
    reviewCount?: number | null;
    category: string;
    stock: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const isInWishlist = wishlist?.some((item: any) => item.id === product.id);

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        await apiRequest("DELETE", `/api/wishlist/${product.id}`);
      } else {
        await apiRequest("POST", "/api/wishlist", { productId: product.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Added to cart",
      description: product.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }
    wishlistMutation.mutate();
  };

  const discount = product.originalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100
      )
    : 0;

  const rating = Number(product.rating || 0);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group card-hover cursor-pointer h-full overflow-hidden border-0 shadow-sm" data-testid={`card-product-${product.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-lg">
                -{discount}%
              </Badge>
            )}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              {user && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full shadow-lg bg-background/90 backdrop-blur-sm"
                  onClick={handleWishlist}
                  data-testid={`button-wishlist-${product.id}`}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isInWishlist ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              )}
              <Button
                size="icon"
                className="h-9 w-9 rounded-full shadow-lg bg-gradient-to-r from-primary to-purple-600 border-0"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                data-testid={`button-add-cart-${product.id}`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-primary/80 uppercase tracking-wide">
              {product.category}
            </p>
            <h3 className="font-semibold line-clamp-2 min-h-[2.75rem] leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < rating
                        ? "fill-amber-400/50 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              {product.reviewCount != null && product.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
