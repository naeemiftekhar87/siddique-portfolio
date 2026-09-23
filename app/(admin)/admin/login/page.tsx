import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return <AdminPlaceholder title="Admin Login" phase={5} />;
}
