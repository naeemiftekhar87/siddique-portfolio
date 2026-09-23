import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return <AdminPlaceholder title="Settings" phase={6} />;
}
