import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { FavoritesClient } from "./favorites-client";

export const metadata: Metadata = {
  title: "Favorites",
  description: "View your favorite items.",
};

export default function FavoritesPage() {
  return (
    <Container className="py-10">
      <FavoritesClient />
    </Container>
  );
}
