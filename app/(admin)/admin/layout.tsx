import type { Metadata } from "next";
import { AdminHtmlTheme } from "@/components/admin/admin-html-theme";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

// Admin shell (dark theme). The wrapper is dark on the server render; the
// client effect extends the theme to <html> for portals. Auth guard: Phase 5.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-theme dark flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <AdminHtmlTheme />
      {children}
    </div>
  );
}
