import type { Metadata } from "next";
import AdminResearch from "@/components/admin/pages/AdminResearch";
import { getPapers, getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Research Papers" };

export default async function Page() {
  const [papers, interests] = await Promise.all([getPapers(), getSettings("research_interests")]);
  return <AdminResearch initial={papers} areas={interests.items} />;
}
