import type { Metadata } from "next";
import CertificateDetail from "@/components/portfolio/pages/CertificateDetail";

export const metadata: Metadata = { title: "Certificate" };

export default async function Page(props: PageProps<"/certificates/[id]">) {
  const { id } = await props.params;
  return <CertificateDetail id={id} />;
}
