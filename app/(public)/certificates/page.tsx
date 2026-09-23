import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Certificates" };

export default function CertificatesPage() {
  return <PagePlaceholder title="Certificates" phase={2} />;
}
