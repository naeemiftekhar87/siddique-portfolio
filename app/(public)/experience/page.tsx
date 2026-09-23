import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return <PagePlaceholder title="Experience" phase={2} />;
}
