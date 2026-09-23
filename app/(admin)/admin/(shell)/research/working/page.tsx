import type { Metadata } from "next";
import AdminResearchWorking from "@/components/admin/pages/AdminResearchWorking";

export const metadata: Metadata = { title: "Working Papers" };

export default function Page() {
  return <AdminResearchWorking />;
}
