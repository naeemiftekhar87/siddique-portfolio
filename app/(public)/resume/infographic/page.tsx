import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Infographic Resume" };

export default function InfographicResumePage() {
  return <PagePlaceholder title="Infographic Resume" phase={4} />;
}
