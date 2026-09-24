import type { Metadata } from "next";

// Admin area: excluded from search engines and always rendered per request
// (it reads the session). The login lives outside the (shell) guard.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
