import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Publications" };

export default function AdminPublicationsPage() {
  return <AdminPlaceholder title="Publications" phase={5} />;
}
