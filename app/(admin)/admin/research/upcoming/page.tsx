import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Upcoming Research" };

export default function AdminUpcomingResearchPage() {
  return <AdminPlaceholder title="Upcoming Research" phase={6} />;
}
