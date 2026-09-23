import AdminLayout from "@/components/admin/pages/AdminLayout";

// Sidebar + top bar shell for every admin module (not the login page).
export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
