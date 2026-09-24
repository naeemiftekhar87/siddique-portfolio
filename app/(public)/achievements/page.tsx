import type { Metadata } from "next";
import Achievements from "@/components/portfolio/pages/Achievements";
import { getAchievements } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Achievements" };

export default async function Page() {
  return <Achievements achievements={await getAchievements()} />;
}
