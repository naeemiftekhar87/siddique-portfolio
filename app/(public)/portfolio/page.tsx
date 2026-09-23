import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return <PagePlaceholder title="Portfolio" phase={2} />;
}
