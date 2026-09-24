import type { Metadata } from "next";
import AdminWebsiteFooter from "@/components/admin/pages/AdminWebsiteFooter";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Footer Editor" };

export default async function Page() {
  const [footer, profile] = await Promise.all([getSettings("footer"), getSettings("profile")]);
  return <AdminWebsiteFooter initial={footer} name={profile.name} />;
}
