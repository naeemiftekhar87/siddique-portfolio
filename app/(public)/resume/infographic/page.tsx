import type { Metadata } from "next";
import InfographicResume from "@/components/portfolio/pages/InfographicResume";
import { loadResumeData } from "@/lib/data/resume";

export const metadata: Metadata = { title: "Infographic Resume" };

export default async function Page() {
  return <InfographicResume {...await loadResumeData("infographic")} />;
}
