import type { Metadata } from "next";
import AdminWebsiteHome from "@/components/admin/pages/AdminWebsiteHome";

export const metadata: Metadata = { title: "Home Page Editor" };

export default function Page() {
  return <AdminWebsiteHome />;
}
