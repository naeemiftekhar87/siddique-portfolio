import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Footer Editor" };

export default function AdminFooterEditorPage() {
  return <AdminPlaceholder title="Footer Editor" phase={6} />;
}
