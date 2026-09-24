import type { Metadata } from "next";
import AdminResearchUpcoming from "@/components/admin/pages/AdminResearchUpcoming";
import { getSettings, getUpcomingResearch } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Upcoming Research" };

export default async function Page() {
  const [topics, interests] = await Promise.all([getUpcomingResearch(), getSettings("research_interests")]);
  return <AdminResearchUpcoming initial={topics} areas={interests.items} />;
}
