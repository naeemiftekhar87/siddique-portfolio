import type { Metadata } from "next";
import About from "@/components/portfolio/pages/About";
import { getEducation, getExperiences, getSettings, getSiteProfile } from "@/lib/data/queries";

export const metadata: Metadata = { title: "About" };

export default async function Page() {
  const [profile, about, education, experiences] = await Promise.all([
    getSiteProfile(), getSettings("about"), getEducation(), getExperiences(),
  ]);
  return <About profile={profile} about={about} education={education} experiences={experiences} />;
}
