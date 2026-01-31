import type { Metadata } from "next";

import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Account profile",
  description: "View your profile information.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
