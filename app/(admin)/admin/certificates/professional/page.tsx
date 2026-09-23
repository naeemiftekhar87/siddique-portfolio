import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Professional Certificates" };

export default function AdminProfessionalCertificatesPage() {
  return <AdminPlaceholder title="Professional Certificates" phase={5} />;
}
