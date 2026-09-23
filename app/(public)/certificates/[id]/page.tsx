import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Certificate" };

export default async function CertificatePage(props: PageProps<"/certificates/[id]">) {
  const { id } = await props.params;
  return <PagePlaceholder title="Certificate" phase={2} detail={`ID: ${id}`} />;
}
