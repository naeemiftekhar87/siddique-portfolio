import Home from "@/components/portfolio/pages/Home";
import {
  getAchievements, getCertificates, getEducation, getExperiences, getPapers, getProjects, getSettings, getSiteProfile, getSkills,
} from "@/lib/data/queries";

export default async function Page() {
  const [profile, home, experiences, education, skills, achievements, researchPapers, certificates, projects] = await Promise.all([
    getSiteProfile(), getSettings("home"), getExperiences(), getEducation(), getSkills(), getAchievements(), getPapers(),
    getCertificates(), getProjects(),
  ]);
  return (
    <Home profile={profile} home={home} experiences={experiences} education={education} skills={skills}
      achievements={achievements} researchPapers={researchPapers} certificates={certificates} projects={projects} />
  );
}
