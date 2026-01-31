"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    console.error(`[ImageWithFallback] Failed to load image: ${src}`);
    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
      className={cn(className, error && "object-contain bg-secondary/50 p-2")}
    />
  );
}
