import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Education" };

export default function AdminEducationPage() {
  return <AdminPlaceholder title="Education" phase={5} />;
}
