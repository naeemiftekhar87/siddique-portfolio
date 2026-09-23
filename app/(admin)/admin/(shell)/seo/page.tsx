import type { Metadata } from "next";
import AdminSEO from "@/components/admin/pages/AdminSEO";

export const metadata: Metadata = { title: "SEO" };

export default function Page() {
  return <AdminSEO />;
}
