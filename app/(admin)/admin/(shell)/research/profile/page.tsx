import type { Metadata } from "next";
import AdminResearchProfile from "@/components/admin/pages/AdminResearchProfile";

export const metadata: Metadata = { title: "Research Profile" };

export default function Page() {
  return <AdminResearchProfile />;
}
