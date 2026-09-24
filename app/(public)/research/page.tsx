import type { Metadata } from "next";
import Research from "@/components/portfolio/pages/Research";
import { isResearchSectionId } from "@/lib/data/research";
import { getPapers, getSiteProfile, getUpcomingResearch } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Research" };

// ?tab=interests|published|upcoming selects the section (shareable URL).
export default async function Page(props: PageProps<"/research">) {
  const { tab } = await props.searchParams;
  const [papers, upcomingTopics, profile] = await Promise.all([getPapers(), getUpcomingResearch(), getSiteProfile()]);
  return (
    <Research papers={papers} upcomingTopics={upcomingTopics} profile={profile}
      initialSection={isResearchSectionId(tab) ? tab : "interests"} />
  );
}
