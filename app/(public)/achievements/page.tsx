import type { Metadata } from "next";
import Achievements from "@/components/portfolio/pages/Achievements";

export const metadata: Metadata = { title: "Achievements" };

export default function Page() {
  return <Achievements />;
}
