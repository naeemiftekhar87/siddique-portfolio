import type { Metadata } from "next";
import AdminResearchInterests from "@/components/admin/pages/AdminResearchInterests";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Research Interests" };

export default async function Page() {
  return <AdminResearchInterests initial={(await getSettings("research_interests")).items} />;
}
