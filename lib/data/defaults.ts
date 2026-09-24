import { defaultSiteColors } from "@/lib/site-colors";
import type {
  AboutSettings,
  ColorSettings,
  FooterSettings,
  HomeSettings,
  LinksSettings,
  NavigationSettings,
  ProfileSettings,
  ResearchInterestsSettings,
  ResearchProfileSettings,
  ResumeConfig,
} from "./schemas";

// Values used until the owner saves each settings screen. Personal content
// starts empty (docs/memory.md decisions 9 and 15); site structure (nav,
// footer links, CTAs) keeps the design's defaults.

export const defaultProfile: ProfileSettings = {
  name: "",
  photo: "",
  badge: "",
  headline: "",
  summary: "",
  location: "",
  email: "",
  stats: { experience: "", degrees: "", certificates: "", research: "", publications: "", skills: "" },
};

/** The owner's real profile links (docs/memory.md §4) are the initial values. */
export const defaultLinks: LinksSettings = {
  linkedin: "https://www.linkedin.com/in/mdtarakesiddique",
  github: "",
  scholar: "https://scholar.google.com/citations?user=ohf_wZIAAAAJ&hl=en",
  researchgate: "https://www.researchgate.net/profile/Md-Siddique-50",
  orcid: "",
};

export const defaultResearchProfile: ResearchProfileSettings = {
  citations: 0,
  hIndex: 0,
  i10Index: 0,
  publications: 0,
  bio: "",
};

export const defaultResearchInterests: ResearchInterestsSettings = { items: [] };

export const defaultHome: HomeSettings = {
  cta1Label: "Explore My Work",
  cta1Link: "/portfolio",
  cta2Label: "View Resume",
  cta2Link: "/resume",
  sections: {
    showStats: true,
    showProfileCards: true,
    showFeatured: true,
    showExperience: true,
    showResearchInterests: true,
  },
};

export const defaultAbout: AboutSettings = { careerFocus: "", academicBio: "", domainExpertise: [] };

export const defaultNavigation: NavigationSettings = {
  links: [
    { id: 1, label: "Home", to: "/", visible: true },
    { id: 2, label: "About", to: "/about", visible: true },
    { id: 3, label: "Certificates", to: "/certificates", visible: true },
    { id: 4, label: "Portfolio", to: "/portfolio", visible: true },
    { id: 5, label: "Research", to: "/research", visible: true },
    { id: 6, label: "eBooks", to: "/ebooks", visible: true },
    { id: 7, label: "Contact", to: "/contact", visible: true },
    { id: 8, label: "Experience", to: "/experience", visible: false },
    { id: 9, label: "Education", to: "/education", visible: false },
    { id: 10, label: "Skills", to: "/skills", visible: false },
    { id: 11, label: "Achievements", to: "/achievements", visible: false },
    { id: 12, label: "Resume", to: "/resume", visible: false },
    { id: 13, label: "Publications", to: "/publications", visible: false },
  ],
};

export const defaultFooter: FooterSettings = {
  tagline: "",
  copyright: "",
  quickLinks: [
    { id: 1, label: "About", to: "/about" },
    { id: 2, label: "Portfolio", to: "/portfolio" },
    { id: 3, label: "Certificates", to: "/certificates" },
    { id: 4, label: "eBooks", to: "/ebooks" },
    { id: 5, label: "Contact", to: "/contact" },
  ],
};

export const defaultColors: ColorSettings = defaultSiteColors;

const baseResume: ResumeConfig = {
  showSummary: true,
  showExperience: true,
  showEducation: true,
  showSkills: true,
  showCertificates: true,
  showResearch: false,
  showLanguages: true,
  experienceLimit: 4,
  skillsLimit: 20,
  accentColor: "#2563eb",
  fontStyle: "serif",
  customNote: "",
};

export const defaultResumeConfigs: Record<"professional" | "infographic", ResumeConfig> = {
  professional: baseResume,
  infographic: { ...baseResume, showResearch: true },
};
