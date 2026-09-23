import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return <PagePlaceholder title="Skills" phase={2} />;
}
