import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Professional Resume" };

export default function AdminProfessionalResumePage() {
  return <AdminPlaceholder title="Professional Resume" phase={6} />;
}
