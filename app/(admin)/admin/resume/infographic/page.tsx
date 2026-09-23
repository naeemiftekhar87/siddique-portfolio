import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Infographic Resume" };

export default function AdminInfographicResumePage() {
  return <AdminPlaceholder title="Infographic Resume" phase={6} />;
}
