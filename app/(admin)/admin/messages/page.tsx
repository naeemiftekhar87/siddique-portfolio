import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return <AdminPlaceholder title="Messages" phase={6} />;
}
