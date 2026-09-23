import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Academic CV" };

export default function AdminAcademicCvPage() {
  return <AdminPlaceholder title="Academic CV" phase={6} />;
}
