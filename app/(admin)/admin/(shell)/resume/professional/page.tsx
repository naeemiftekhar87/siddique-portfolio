import type { Metadata } from "next";
import AdminResumeEditor from "@/components/admin/pages/AdminResumeEditor";
import { getEducation, getExperiences, getPapers, getSettings, getSkills } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Professional Resume" };

export default async function Page() {
  const [config, profile, experiences, education, skills, papers] = await Promise.all([
    getSettings("resume_professional"), getSettings("profile"), getExperiences(), getEducation(), getSkills(), getPapers(),
  ]);
  return (
    <AdminResumeEditor variant="professional" initial={config} profile={profile}
      experiences={experiences} education={education} skills={skills} researchPapers={papers} />
  );
}
