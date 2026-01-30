/**
 * Star Rating Component
 *
 * Displays star ratings with support for full, half, and empty stars.
 * Can be interactive for user ratings or read-only for display.
 *
 * @module components/common
 */

"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StarRatingProps {
  /** Current rating value (0-5, supports decimals) */
  rating: number;
  /** Maximum number of stars (default: 5) */
  max?: number;
  /** Size of the stars */
  size?: "sm" | "md" | "lg";
  /** Whether the rating is interactive (click to rate) */
  interactive?: boolean;
  /** Callback when user selects a rating */
  onRate?: (rating: number) => void;
  /** Whether to show the numeric rating value */
  showValue?: boolean;
  /** Number of reviews to display alongside rating */
  reviewCount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Star Rating component for displaying and capturing ratings
 *
 * @example
 * ```tsx
 * // Read-only display
 * <StarRating rating={4.5} reviewCount={128} />
 *
 * // Interactive rating
 * <StarRating
 *   rating={currentRating}
 *   interactive
 *   onRate={(value) => setRating(value)}
 * />
 * ```
 */
export function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onRate,
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  const containerSizes = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const handleClick = (index: number) => {
    if (interactive && onRate) {
      onRate(index + 1);
    }
  };

  const displayRating = hoverRating ?? rating;

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = displayRating >= starValue;
    const halfFilled = !filled && displayRating >= starValue - 0.5;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          interactive && "cursor-pointer hover:scale-110",
          !interactive && "cursor-default"
        )}
        aria-label={interactive ? `Rate ${starValue} out of ${max} stars` : undefined}
        aria-pressed={interactive && rating === starValue}
      >
        {/* Background star (empty) */}
        <Star
          className={cn(
            sizeClasses[size],
            "text-muted-foreground",
            filled && "hidden",
            !filled && !halfFilled && "fill-muted-foreground"
          )}
        />

        {/* Full filled star */}
        {filled && (
          <Star
            className={cn(
              sizeClasses[size],
              "fill-warning text-warning"
            )}
          />
        )}

        {/* Half filled star */}
        {halfFilled && (
          <div className="relative">
            <Star className={cn(sizeClasses[size], "text-muted-foreground")} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "fill-warning text-warning"
                )}
              />
            </div>
          </div>
        )}
      </button>
    );
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center",
          containerSizes[size],
          interactive && "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md"
        )}
        role={interactive ? "radiogroup" : "img"}
        aria-label={interactive ? "Star rating" : `Rating: ${rating} out of ${max}`}
      >
        {Array.from({ length: max }).map((_, index) => renderStar(index))}
      </div>

      {(showValue || reviewCount !== undefined) && (
        <div className={cn("flex items-center gap-1 text-muted-foreground", textSizes[size])}>
          {showValue && (
            <span className="font-medium">
              {rating.toFixed(1)}
            </span>
          )}
          {showValue && reviewCount !== undefined && (
            <span>•</span>
          )}
          {reviewCount !== undefined && (
            <span>
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StarRating;
