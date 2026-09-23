import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Research Papers" };

export default function AdminResearchPapersPage() {
  return <AdminPlaceholder title="Research Papers" phase={5} />;
}
