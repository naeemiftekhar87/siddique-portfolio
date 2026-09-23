import type { Metadata } from "next";
import AdminWebsiteNavigation from "@/components/admin/pages/AdminWebsiteNavigation";

export const metadata: Metadata = { title: "Navigation Editor" };

export default function Page() {
  return <AdminWebsiteNavigation />;
}
