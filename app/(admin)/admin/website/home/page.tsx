import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Home Page Editor" };

export default function AdminHomePageEditorPage() {
  return <AdminPlaceholder title="Home Page Editor" phase={6} />;
}
