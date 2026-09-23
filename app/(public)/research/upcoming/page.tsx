import type { Metadata } from "next";
import UpcomingResearch from "@/components/portfolio/pages/UpcomingResearch";

export const metadata: Metadata = { title: "Upcoming Research" };

export default function Page() {
  return <UpcomingResearch />;
}
