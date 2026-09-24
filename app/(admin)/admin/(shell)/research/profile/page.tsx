import type { Metadata } from "next";
import AdminResearchProfile from "@/components/admin/pages/AdminResearchProfile";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Research Profile" };

export default async function Page() {
  return <AdminResearchProfile initial={await getSettings("research_profile")} />;
}
