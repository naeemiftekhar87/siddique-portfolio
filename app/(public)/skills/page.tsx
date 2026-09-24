import type { Metadata } from "next";
import Skills from "@/components/portfolio/pages/Skills";
import { getSkills } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Skills" };

export default async function Page() {
  return <Skills skills={await getSkills()} />;
}
