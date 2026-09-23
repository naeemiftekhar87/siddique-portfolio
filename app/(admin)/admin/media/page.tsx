import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Media Library" };

export default function AdminMediaLibraryPage() {
  return <AdminPlaceholder title="Media Library" phase={6} />;
}
