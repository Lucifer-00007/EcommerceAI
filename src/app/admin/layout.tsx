import { AdminGate } from "@/app/admin/admin-gate";
import { AdminNav } from "@/app/admin/nav";
import { Container } from "@/components/layout/container";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <AdminGate>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-1 px-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your store
                </p>
              </div>
              <AdminNav />
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </AdminGate>
    </Container>
  );
}

