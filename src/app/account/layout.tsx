import { AccountNav } from "./nav";
import { Container } from "@/components/layout/container";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="space-y-1 px-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Account</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>
            <AccountNav />
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </Container>
  );
}

