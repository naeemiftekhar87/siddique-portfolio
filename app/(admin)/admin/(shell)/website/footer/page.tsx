import type { Metadata } from "next";
import AdminWebsiteFooter from "@/components/admin/pages/AdminWebsiteFooter";

export const metadata: Metadata = { title: "Footer Editor" };

export default function Page() {
  return <AdminWebsiteFooter />;
}
