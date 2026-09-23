import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Projects" };

export default function AdminProjectsPage() {
  return <AdminPlaceholder title="Projects" phase={5} />;
}
