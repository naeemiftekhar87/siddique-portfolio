import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Research CV" };

export default function AdminResearchCvPage() {
  return <AdminPlaceholder title="Research CV" phase={6} />;
}
