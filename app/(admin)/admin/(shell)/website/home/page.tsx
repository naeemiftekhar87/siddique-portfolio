import type { Metadata } from "next";
import AdminWebsiteHome from "@/components/admin/pages/AdminWebsiteHome";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Home Page Editor" };

export default async function Page() {
  return <AdminWebsiteHome initial={await getSettings("home")} />;
}
