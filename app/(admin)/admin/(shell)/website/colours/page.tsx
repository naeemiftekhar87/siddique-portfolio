import type { Metadata } from "next";
import AdminWebsiteColors from "@/components/admin/pages/AdminWebsiteColors";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Colours Editor" };

export default async function Page() {
  const [colors, profile] = await Promise.all([getSettings("colors"), getSettings("profile")]);
  return <AdminWebsiteColors initial={colors} name={profile.name} />;
}
