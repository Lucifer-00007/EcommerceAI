import { Container } from "@/components/layout/container";
import { AccountNav } from "./nav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="space-y-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">Profile and orders.</p>
      </div>
      <AccountNav />
      {children}
    </Container>
  );
}

