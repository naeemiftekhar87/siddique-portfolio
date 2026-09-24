import type { Metadata } from "next";
import AdminAchievements from "@/components/admin/pages/AdminAchievements";
import { getAchievements } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Achievements" };

export default async function Page() {
  return <AdminAchievements initial={await getAchievements()} />;
}
