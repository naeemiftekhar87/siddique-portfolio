import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Achievements" };

export default function AchievementsPage() {
  return <PagePlaceholder title="Achievements" phase={2} />;
}
