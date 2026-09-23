import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Academic Certificates" };

export default function AdminAcademicCertificatesPage() {
  return <AdminPlaceholder title="Academic Certificates" phase={5} />;
}
