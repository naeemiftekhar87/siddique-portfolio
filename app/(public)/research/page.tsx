import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return <PagePlaceholder title="Research" phase={3} />;
}
