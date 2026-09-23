import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Working Papers" };

export default function AdminWorkingPapersPage() {
  return <AdminPlaceholder title="Working Papers" phase={6} />;
}
