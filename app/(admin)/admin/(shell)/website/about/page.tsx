import type { Metadata } from "next";
import AdminWebsiteAbout from "@/components/admin/pages/AdminWebsiteAbout";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "About Page Editor" };

export default async function Page() {
  return <AdminWebsiteAbout initial={await getSettings("about")} />;
}
