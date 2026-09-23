import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Experience" };

export default function AdminExperiencePage() {
  return <AdminPlaceholder title="Experience" phase={5} />;
}
