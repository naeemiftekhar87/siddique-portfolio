import type { Metadata } from "next";
import Certificates from "@/components/portfolio/pages/Certificates";
import { getCertificates } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Certificates" };

export default async function Page() {
  return <Certificates certificates={await getCertificates()} />;
}
