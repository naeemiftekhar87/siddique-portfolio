import type { Metadata } from "next";
import UpcomingResearch from "@/components/portfolio/pages/UpcomingResearch";
import { getUpcomingResearch } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Upcoming Research" };

export default async function Page() {
  return <UpcomingResearch topics={await getUpcomingResearch()} />;
}
