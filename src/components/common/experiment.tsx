"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export type ExperimentVariant = "A" | "B";

function storageKey(key: string) {
  return `ecommerceai:exp:${key}`;
}

function chooseVariant(seed: string): ExperimentVariant {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "A" : "B";
}

export function useExperimentVariant(experimentKey: string): ExperimentVariant {
  const searchParams = useSearchParams();
  const forced = searchParams.get(`exp_${experimentKey}`) as ExperimentVariant | null;
  const normalizedForced = useMemo(
    () => (forced === "A" || forced === "B" ? forced : null),
    [forced],
  );

  return useMemo(() => {
    if (normalizedForced) return normalizedForced;
    if (typeof window === "undefined") return "A";
    try {
      const stored = window.localStorage.getItem(storageKey(experimentKey)) as ExperimentVariant | null;
      if (stored === "A" || stored === "B") return stored;
      const next = chooseVariant(`${experimentKey}:${window.location.pathname}`);
      window.localStorage.setItem(storageKey(experimentKey), next);
      return next;
    } catch {
      return "A";
    }
  }, [experimentKey, normalizedForced]);
}

export function Experiment({
  experimentKey,
  children,
}: {
  experimentKey: string;
  children: (variant: ExperimentVariant) => React.ReactNode;
}) {
  const variant = useExperimentVariant(experimentKey);
  return children(variant);
}
