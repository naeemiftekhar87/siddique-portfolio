import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PagePlaceholder title="About" phase={2} />;
}
