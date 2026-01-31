import { AdminGate } from "@/app/admin/admin-gate";
import { AdminNav } from "@/app/admin/nav";
import { Container } from "@/components/layout/container";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="space-y-6 py-10">
      <AdminGate>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Manage products, pages, and integrations.
          </p>
        </div>
        <AdminNav />
        {children}
      </AdminGate>
    </Container>
  );
}

