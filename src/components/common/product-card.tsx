/**
 * Product Card Component
 *
 * Displays product information with image, name, price, rating, and quick actions.
 * Supports default and compact variants.
 *
 * @module components/common
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";
import { StarRating } from "./star-rating";
import { Price } from "./price";

export interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Visual variant of the card */
  variant?: "default" | "compact";
  /** Additional CSS classes */
  className?: string;
  /** Callback when quick add is clicked */
  onQuickAdd?: (product: Product) => void;
  /** Callback when wishlist toggle is clicked */
  onWishlistToggle?: (product: Product) => void;
  /** Whether the product is in the wishlist */
  isWishlisted?: boolean;
}

/**
 * Product Card component for displaying products in grid/list views
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={product}
 *   variant="default"
 *   onQuickAdd={handleAddToCart}
 *   onWishlistToggle={handleWishlist}
 * />
 * ```
 */
export function ProductCard({
  product,
  variant = "default",
  className,
  onQuickAdd,
  onWishlistToggle,
  isWishlisted = false,
}: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const isOnSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const hasDiscount = isOnSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd?.(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(product);
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "group relative flex flex-col gap-2 overflow-hidden rounded-lg border bg-card p-3 transition-all hover:shadow-md",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2 px-1.5 py-0.5 text-xs"
            >
              -{hasDiscount}%
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-2 h-7 w-7 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
            )}
          />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-1 text-sm font-medium text-card-foreground">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
          <Price
            amount={product.price}
            compareAtPrice={product.compareAtPrice}
            className="text-sm font-semibold"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <Badge
            variant="destructive"
            className="absolute left-3 top-3"
          >
            Save {hasDiscount}%
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-3 top-3 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
            )}
          />
        </Button>

        {/* Quick Add Button */}
        {product.inventory > 0 ? (
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              className="w-full gap-2"
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </Button>
          </div>
        ) : null}

        {/* Out of Stock Overlay */}
          {product.inventory === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        <h3 className="line-clamp-2 font-medium leading-tight text-card-foreground group-hover:text-primary">
          {product.name}
        </h3>

        <StarRating
          rating={product.rating}
          size="sm"
          showValue
          reviewCount={product.reviewCount}
        />

        <Price
          amount={product.price}
          compareAtPrice={product.compareAtPrice}
          showSavings={isOnSale}
          className="mt-1"
        />
      </div>
    </Link>
  );
}

export default ProductCard;
