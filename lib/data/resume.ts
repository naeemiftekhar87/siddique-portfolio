import "server-only";
import {
  getCertificates, getEducation, getExperiences, getLanguages, getPapers, getSettings, getSiteProfile, getSkills,
} from "./queries";

/** Everything a resume variant renders, from the one shared data source (rules §21). */
export async function loadResumeData(variant: "professional" | "infographic") {
  const [profile, config, experiences, education, skills, certificates, languages, papers] = await Promise.all([
    getSiteProfile(),
    getSettings(variant === "professional" ? "resume_professional" : "resume_infographic"),
    getExperiences(),
    getEducation(),
    getSkills(),
    getCertificates(),
    getLanguages(),
    getPapers(),
  ]);
  return { profile, config, experiences, education, skills, certificates, languages, papers };
}
