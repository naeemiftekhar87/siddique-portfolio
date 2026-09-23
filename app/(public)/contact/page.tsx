import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <PagePlaceholder title="Contact" phase={2} />;
}
