import AdminLayout from "@/components/admin/pages/AdminLayout";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/auth/session";

// Sidebar + top bar shell for every admin module (not the login page).
// requireAdmin() is the authoritative guard; proxy.ts only redirects early.
export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <AdminLayout email={user.email ?? ""}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        style={{ "--normal-bg": "#0f172a", "--normal-text": "#e2e8f0", "--normal-border": "#1e293b" } as React.CSSProperties}
      />
    </AdminLayout>
  );
}
