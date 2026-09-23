import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Resume Center" };

export default function ResumeCenterPage() {
  return <PagePlaceholder title="Resume Center" phase={4} />;
}
