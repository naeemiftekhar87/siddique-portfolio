import type { Metadata } from "next";
import AdminCertificates from "@/components/admin/pages/AdminCertificates";
import { getCertificates } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Certificates" };

export default async function Page() {
  return <AdminCertificates initial={await getCertificates()} />;
}
