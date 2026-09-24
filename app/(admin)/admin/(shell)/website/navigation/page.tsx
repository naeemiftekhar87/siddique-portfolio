import type { Metadata } from "next";
import AdminWebsiteNavigation from "@/components/admin/pages/AdminWebsiteNavigation";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Navigation Editor" };

export default async function Page() {
  return <AdminWebsiteNavigation initial={(await getSettings("navigation")).links} />;
}
