import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Research Profile" };

export default function AdminResearchProfilePage() {
  return <AdminPlaceholder title="Research Profile" phase={6} />;
}
