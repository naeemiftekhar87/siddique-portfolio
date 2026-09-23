import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "eBooks" };

export default function AdminEbooksPage() {
  return <AdminPlaceholder title="eBooks" phase={5} />;
}
