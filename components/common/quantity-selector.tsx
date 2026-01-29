/**
 * Quantity Selector Component
 *
 * Interactive quantity input with increment/decrement buttons.
 * Supports min/max bounds and direct text input with validation.
 *
 * @module components/common
 */

"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface QuantitySelectorProps {
  /** Current quantity value */
  value: number;
  /** Minimum allowed quantity (default: 1) */
  min?: number;
  /** Maximum allowed quantity */
  max?: number;
  /** Callback when quantity changes */
  onChange: (value: number) => void;
  /** Size variant of the selector */
  size?: "sm" | "md" | "lg";
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Quantity selector with +/- buttons and direct input
 *
 * @example
 * ```tsx
 * <QuantitySelector
 *   value={quantity}
 *   min={1}
 *   max={10}
 *   onChange={setQuantity}
 * />
 * ```
 */
export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = React.useState(String(value));

  // Sync input value with prop value
  React.useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only update if valid number
    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Validate on blur
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min) {
      onChange(min);
    } else if (numValue > max) {
      onChange(max);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const sizeClasses = {
    sm: {
      container: "h-7",
      button: "h-7 w-7 px-0",
      input: "h-7 w-10 text-xs",
    },
    md: {
      container: "h-9",
      button: "h-9 w-9 px-0",
      input: "h-9 w-12 text-sm",
    },
    lg: {
      container: "h-11",
      button: "h-11 w-11 px-0",
      input: "h-11 w-14 text-base",
    },
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border",
        sizeClasses[size].container,
        disabled && "opacity-50",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses[size].button,
          "rounded-r-none border-r hover:bg-muted"
        )}
        onClick={handleDecrement}
        disabled={disabled || isAtMin}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSizes[size]} />
      </Button>

      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          sizeClasses[size].input,
          "border-0 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-0 focus-visible:ring-offset-0"
        )}
        aria-label="Quantity"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        role="spinbutton"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses[size].button,
          "rounded-l-none border-l hover:bg-muted"
        )}
        onClick={handleIncrement}
        disabled={disabled || isAtMax}
        aria-label="Increase quantity"
      >
        <Plus className={iconSizes[size]} />
      </Button>
    </div>
  );
}

export default QuantitySelector;
