import type { Metadata } from "next";
import Resume from "@/components/portfolio/pages/Resume";
import { loadResumeData } from "@/lib/data/resume";

export const metadata: Metadata = { title: "Resume Center" };

export default async function Page() {
  return <Resume {...await loadResumeData("professional")} />;
}
