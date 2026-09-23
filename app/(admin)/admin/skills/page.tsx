import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Skills" };

export default function AdminSkillsPage() {
  return <AdminPlaceholder title="Skills" phase={5} />;
}
