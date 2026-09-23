import type { Metadata } from "next";
import AdminResearch from "@/components/admin/pages/AdminResearch";

export const metadata: Metadata = { title: "Research Papers" };

export default function Page() {
  return <AdminResearch />;
}
