import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "About Page Editor" };

export default function AdminAboutPageEditorPage() {
  return <AdminPlaceholder title="About Page Editor" phase={6} />;
}
