import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Education" };

export default function EducationPage() {
  return <PagePlaceholder title="Education" phase={2} />;
}
