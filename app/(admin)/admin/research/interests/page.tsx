import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Research Interests" };

export default function AdminResearchInterestsPage() {
  return <AdminPlaceholder title="Research Interests" phase={6} />;
}
