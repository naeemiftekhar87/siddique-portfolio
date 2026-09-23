import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Navigation Editor" };

export default function AdminNavigationEditorPage() {
  return <AdminPlaceholder title="Navigation Editor" phase={6} />;
}
