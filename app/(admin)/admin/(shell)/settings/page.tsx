import type { Metadata } from "next";
import AdminSettings from "@/components/admin/pages/AdminSettings";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Settings" };

export default async function Page() {
  return <AdminSettings initial={await getSettings("links")} />;
}
