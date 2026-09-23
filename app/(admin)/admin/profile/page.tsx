import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Personal Information" };

export default function AdminPersonalInformationPage() {
  return <AdminPlaceholder title="Personal Information" phase={5} />;
}
