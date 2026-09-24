import { z } from "zod";
import {
  achievementCategories,
  certificateCategories,
  educationStatuses,
  galleryCategories,
  paperStatuses,
  portfolioColors,
  projectStatuses,
  skillCategories,
  upcomingStatuses,
} from "./constants";

/**
 * Validation schemas for every admin write, plus the domain types the UI
 * uses (camelCase). Server Actions parse all input with these; the database
 * mappers live in lib/data/mappers.ts.
 */

const text = (max = 500) => z.string().trim().max(max);
const required = (label: string, max = 300) => z.string().trim().min(1, `${label} is required.`).max(max);
const list = (max = 60, itemMax = 300) => z.array(z.string().trim().min(1).max(itemMax)).max(max);
const percent = z.coerce.number().int().min(0).max(100);
const year = z.union([z.coerce.number().int().min(1900).max(2200), z.null()]);

/**
 * Relative site path (/about) or absolute http(s) URL; empty allowed.
 * "//host" and "/\host" are rejected: browsers treat them as external links.
 */
const linkSchema = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (v) => v === "" || /^\/(?![\/\\])/.test(v) || /^https?:\/\//i.test(v),
    "Use a /path or an http(s) URL.",
  );

/** Absolute http(s) URL; empty allowed. */
const urlSchema = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Use an http(s) URL.");

const id = z.number().int().positive().optional();

// ─── Collections ───────────────────────────────────────────────────────────

export const experienceSchema = z.object({
  id,
  company: required("Company"),
  position: required("Job title"),
  type: text(100),
  startDate: text(50),
  endDate: text(50),
  location: text(200),
  description: text(4000),
  responsibilities: list(),
  achievements: list(),
  skills: list(),
  logo: urlSchema,
});

export const educationSchema = z.object({
  id,
  university: required("University / institution"),
  degree: required("Degree"),
  major: text(300),
  startDate: text(50),
  endDate: text(50),
  status: z.enum(educationStatuses),
  gpa: text(50),
  description: text(4000),
  coursework: list(),
  skills: list(),
  logo: urlSchema,
});

export const skillSchema = z.object({
  id,
  name: required("Skill name", 120),
  category: z.enum(skillCategories),
  level: percent,
});

export const achievementSchema = z.object({
  id,
  title: required("Title"),
  organization: text(300),
  date: text(50),
  description: text(4000),
  category: z.enum(achievementCategories),
  pinned: z.boolean().default(false),
});

export const certificateSchema = z.object({
  id,
  title: required("Certificate title"),
  issuer: required("Issuer"),
  category: z.enum(certificateCategories),
  completionDate: text(100),
  grade: text(100),
  duration: text(100),
  credentialId: text(200),
  skills: list(),
  description: text(4000),
  image: urlSchema,
  verified: z.boolean().default(false),
  verifyUrl: urlSchema,
});

export const portfolioCategorySchema = z.object({
  id,
  name: required("Name", 100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens."),
  description: text(500),
  color: z.enum(portfolioColors),
});

export const projectSchema = z.object({
  id,
  title: required("Project title"),
  categoryId: z.number().int().positive().nullable(),
  shortDescription: text(500),
  description: text(6000),
  technologies: list(),
  tools: list(),
  image: urlSchema,
  problem: text(4000),
  objective: text(4000),
  methodology: text(4000),
  results: text(4000),
  status: z.enum(projectStatuses),
  link: linkSchema,
});

export const galleryItemSchema = z.object({
  id,
  title: required("Title"),
  imageUrl: urlSchema.refine((v) => v !== "", "Image is required."),
  caption: text(1000),
  category: z.enum(galleryCategories),
  projectLink: linkSchema,
});

export const paperSchema = z.object({
  id,
  title: required("Title", 500),
  authors: list(50),
  journal: text(300),
  year,
  area: text(200),
  status: z.enum(paperStatuses),
  abstract: text(8000),
  keywords: list(),
  doi: text(200),
  url: urlSchema,
  pdfUrl: urlSchema,
  version: text(50),
  submissionDate: z.union([z.iso.date(), z.literal(""), z.null()]).transform((v) => v || null),
  preprintUrl: urlSchema,
});

export const upcomingSchema = z.object({
  id,
  title: required("Title", 500),
  area: text(200),
  status: z.enum(upcomingStatuses),
  expectedYear: text(20),
  question: text(4000),
  contribution: text(4000),
  methodology: text(4000),
  keywords: list(),
});

export const languageSchema = z.object({
  id,
  name: required("Language", 100),
  flag: text(20),
  level: text(100),
  proficiency: percent,
});

export const ebookSchema = z.object({
  id,
  title: required("Title"),
  subtitle: text(300),
  author: text(200),
  image: urlSchema,
  category: text(100),
  pages: z.coerce.number().int().min(0).max(100000),
  year,
  isbn: text(50),
  description: text(6000),
  fileUrl: urlSchema,
});

export type Experience = z.infer<typeof experienceSchema> & { id: number };
export type Education = z.infer<typeof educationSchema> & { id: number };
export type Skill = z.infer<typeof skillSchema> & { id: number };
export type Achievement = z.infer<typeof achievementSchema> & { id: number };
export type Certificate = z.infer<typeof certificateSchema> & { id: number };
export type PortfolioCategory = z.infer<typeof portfolioCategorySchema> & { id: number; projectCount: number };
export type Project = z.infer<typeof projectSchema> & { id: number; category: string };
export type GalleryItem = z.infer<typeof galleryItemSchema> & { id: number };
export type Paper = z.infer<typeof paperSchema> & { id: number };
export type UpcomingResearch = z.infer<typeof upcomingSchema> & { id: number };
export type Language = z.infer<typeof languageSchema> & { id: number };
export type EBook = z.infer<typeof ebookSchema> & { id: number; downloads: number };

// ─── Singletons (site_settings) ────────────────────────────────────────────

const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i, "Use a #rrggbb colour.");

export const profileSettingsSchema = z.object({
  name: text(120),
  photo: urlSchema,
  badge: text(200),
  headline: text(300),
  summary: text(4000),
  location: text(200),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.").max(200)]),
  stats: z.object({
    experience: text(20),
    degrees: text(20),
    certificates: text(20),
    research: text(20),
    publications: text(20),
    skills: text(20),
  }),
});

export const linksSettingsSchema = z.object({
  linkedin: urlSchema,
  github: urlSchema,
  scholar: urlSchema,
  researchgate: urlSchema,
  orcid: urlSchema,
});

export const researchProfileSettingsSchema = z.object({
  citations: z.coerce.number().int().min(0).max(10_000_000),
  hIndex: z.coerce.number().int().min(0).max(10_000),
  i10Index: z.coerce.number().int().min(0).max(10_000),
  publications: z.coerce.number().int().min(0).max(100_000),
  bio: text(4000),
});

export const researchInterestsSettingsSchema = z.object({
  items: z.array(z.string().trim().min(1).max(120)).max(100),
});

export const homeSettingsSchema = z.object({
  cta1Label: text(60),
  cta1Link: linkSchema,
  cta2Label: text(60),
  cta2Link: linkSchema,
  sections: z.object({
    showStats: z.boolean(),
    showProfileCards: z.boolean(),
    showFeatured: z.boolean(),
    showExperience: z.boolean(),
    showResearchInterests: z.boolean(),
  }),
});

export const aboutSettingsSchema = z.object({
  careerFocus: text(4000),
  academicBio: text(4000),
  domainExpertise: z.array(z.string().trim().min(1).max(100)).max(50),
});

const navLinkSchema = z.object({
  id: z.number().int(),
  label: required("Label", 60),
  to: linkSchema.refine((v) => v !== "", "Link is required."),
  visible: z.boolean(),
});

export const navigationSettingsSchema = z.object({ links: z.array(navLinkSchema).max(30) });

export const footerSettingsSchema = z.object({
  tagline: text(500),
  copyright: text(200),
  quickLinks: z.array(navLinkSchema.omit({ visible: true })).max(20),
});

export const colorSettingsSchema = z.object({
  navbar: hexColor,
  footer: hexColor,
  pageTop: hexColor,
  pageBody: hexColor,
});

export const resumeConfigSchema = z.object({
  showSummary: z.boolean(),
  showExperience: z.boolean(),
  showEducation: z.boolean(),
  showSkills: z.boolean(),
  showCertificates: z.boolean(),
  showResearch: z.boolean(),
  showLanguages: z.boolean(),
  experienceLimit: z.coerce.number().int().min(1).max(10),
  skillsLimit: z.coerce.number().int().min(1).max(50),
  accentColor: hexColor,
  fontStyle: z.enum(["serif", "sans"]),
  customNote: text(1000),
});

export type ProfileSettings = z.infer<typeof profileSettingsSchema>;
export type LinksSettings = z.infer<typeof linksSettingsSchema>;
export type ResearchProfileSettings = z.infer<typeof researchProfileSettingsSchema>;
export type ResearchInterestsSettings = z.infer<typeof researchInterestsSettingsSchema>;
export type HomeSettings = z.infer<typeof homeSettingsSchema>;
export type AboutSettings = z.infer<typeof aboutSettingsSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type NavigationSettings = z.infer<typeof navigationSettingsSchema>;
export type FooterSettings = z.infer<typeof footerSettingsSchema>;
export type ColorSettings = z.infer<typeof colorSettingsSchema>;
export type ResumeConfig = z.infer<typeof resumeConfigSchema>;
