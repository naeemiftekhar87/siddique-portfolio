import type { Metadata } from "next";
import Education from "@/components/portfolio/pages/Education";
import { getEducation, getSiteProfile } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Education" };

export default async function Page() {
  const [education, profile] = await Promise.all([getEducation(), getSiteProfile()]);
  return <Education education={education} profile={profile} />;
}
