import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Publications" };

export default function PublicationsPage() {
  return <PagePlaceholder title="Publications" phase={3} />;
}
