"use client";

import { useEffect } from "react";

import { EmptyState } from "@/components/common/empty-state";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {}, [error]);
  return <EmptyState title="Failed to load cloth" description={error.message} />;
}

