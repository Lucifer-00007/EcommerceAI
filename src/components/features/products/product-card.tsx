'use client';

// Product card component
// Card component for displaying product information

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Eye, Heart, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Product } from '@/types/product.types';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';

/**
 * Product card component props
 */
interface ProductCardProps {
  /** The product to display */
  product: Product;
  /** Whether to show the add to cart button (default: true) */
  showAddToCart?: boolean;
  /** Whether to show the quick view button (default: true) */
  showQuickView?: boolean;
  /** Whether to show the wishlist button (default: true) */
  showWishlist?: boolean;
}

/**
 * Product card component
 * Displays product information with image, price, rating, and action buttons
 */
export default function ProductCard({
  product,
  showAddToCart = true,
  showQuickView = true,
  showWishlist = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, isInCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);
    try {
      addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock,
        },
        1,
      );
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    toast({
      title: 'Quick View',
      description: 'Quick view feature coming soon!',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    toast({
      title: 'Wishlist',
      description: 'Wishlist feature coming soon!',
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
              -{discount}%
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div
            className={`absolute right-2 top-2 flex flex-col space-y-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {showQuickView && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={handleQuickView}
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {showWishlist && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={handleWishlist}
                aria-label="Add to wishlist"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-background px-3 py-1 text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="mb-1 text-xs text-muted-foreground">{product.category}</p>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-2 flex items-center space-x-2">
            {renderStars(product.rating)}
            <span className="text-xs text-muted-foreground">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="mb-3 flex items-center space-x-2">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && product.stock > 0 && (
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isAdding || isInCart(product.id)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isAdding
                ? 'Adding...'
                : isInCart(product.id)
                ? 'In Cart'
                : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}
