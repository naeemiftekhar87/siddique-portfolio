import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "SEO" };

export default function AdminSeoPage() {
  return <AdminPlaceholder title="SEO" phase={6} />;
}
