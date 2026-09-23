import type { Metadata } from "next";
import AdminCertificates from "@/components/admin/pages/AdminCertificates";

export const metadata: Metadata = { title: "Awards" };

export default function Page() {
  return <AdminCertificates />;
}
