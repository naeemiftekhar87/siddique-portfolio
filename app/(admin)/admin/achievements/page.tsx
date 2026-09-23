import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Achievements" };

export default function AdminAchievementsPage() {
  return <AdminPlaceholder title="Achievements" phase={5} />;
}
