import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Upcoming Research" };

export default function UpcomingResearchPage() {
  return <PagePlaceholder title="Upcoming Research" phase={3} />;
}
