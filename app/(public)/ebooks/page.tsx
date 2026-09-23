import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "eBooks" };

export default function EbooksPage() {
  return <PagePlaceholder title="eBooks" phase={3} />;
}
