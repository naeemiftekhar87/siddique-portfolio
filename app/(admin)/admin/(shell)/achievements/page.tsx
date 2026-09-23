import type { Metadata } from "next";
import AdminAchievements from "@/components/admin/pages/AdminAchievements";

export const metadata: Metadata = { title: "Achievements" };

export default function Page() {
  return <AdminAchievements />;
}
