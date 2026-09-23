import type { Metadata } from "next";

// Admin area: excluded from search engines. Real authentication and the
// route guard arrive in Phase 5; the ported login screen is a UI mock.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
