"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
