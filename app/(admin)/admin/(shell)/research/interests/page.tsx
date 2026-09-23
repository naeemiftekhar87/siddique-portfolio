import type { Metadata } from "next";
import AdminResearchInterests from "@/components/admin/pages/AdminResearchInterests";

export const metadata: Metadata = { title: "Research Interests" };

export default function Page() {
  return <AdminResearchInterests />;
}
