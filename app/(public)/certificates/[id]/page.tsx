import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CertificateDetail from "@/components/portfolio/pages/CertificateDetail";
import { getCertificate, getCertificates, parseId } from "@/lib/data/queries";

async function load(props: PageProps<"/certificates/[id]">) {
  const id = parseId((await props.params).id);
  return id ? getCertificate(id) : null;
}

export async function generateMetadata(props: PageProps<"/certificates/[id]">): Promise<Metadata> {
  return { title: (await load(props))?.title ?? "Certificate" };
}

export default async function Page(props: PageProps<"/certificates/[id]">) {
  const cert = await load(props);
  if (!cert) notFound();
  const related = (await getCertificates()).filter((c) => c.id !== cert.id && c.category === cert.category).slice(0, 2);
  return <CertificateDetail cert={cert} related={related} />;
}
