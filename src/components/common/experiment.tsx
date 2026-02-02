"use client";

import { useMemo, useState, useEffect } from "react";
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

  // Initialize with "A" (or forced value) to ensure Server and Client match on first render.
  const [variant, setVariant] = useState<ExperimentVariant>(normalizedForced ?? "A");

  useEffect(() => {
    // If we have a forced value from URL, we don't need to check storage
    if (normalizedForced) return;

    try {
      const storageK = storageKey(experimentKey);
      const stored = window.localStorage.getItem(storageK) as ExperimentVariant | null;
      if (stored === "A" || stored === "B") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVariant(stored);
        return;
      }
      const next = chooseVariant(`${experimentKey}:${window.location.pathname}`);
      window.localStorage.setItem(storageK, next);
       
      setVariant(next);
    } catch {
      // Ignore errors (e.g. storage quota, security)
    }
  }, [experimentKey, normalizedForced]);

  return variant;
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
