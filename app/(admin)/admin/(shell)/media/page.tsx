import type { Metadata } from "next";
import AdminMedia from "@/components/admin/pages/AdminMedia";

export const metadata: Metadata = { title: "Media Library" };

export default function Page() {
  return <AdminMedia />;
}
