import type { Metadata } from "next";
import Experience from "@/components/portfolio/pages/Experience";
import { getExperiences, getSiteProfile } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Experience" };

export default async function Page() {
  const [experiences, profile] = await Promise.all([getExperiences(), getSiteProfile()]);
  return <Experience experiences={experiences} profile={profile} />;
}
