import type { Tables, TablesInsert } from "@/lib/db/database.types";
import type {
  Achievement,
  Certificate,
  EBook,
  Education,
  Experience,
  GalleryItem,
  Language,
  Paper,
  PortfolioCategory,
  Project,
  Skill,
  UpcomingResearch,
} from "./schemas";
import type { PaperStatus } from "./constants";
import type { z } from "zod";
import type {
  achievementSchema,
  certificateSchema,
  ebookSchema,
  educationSchema,
  experienceSchema,
  galleryItemSchema,
  languageSchema,
  paperSchema,
  portfolioCategorySchema,
  projectSchema,
  skillSchema,
  upcomingSchema,
} from "./schemas";

// Row (snake_case, database) ⇄ domain (camelCase, UI) conversions. Row
// values that violate a pick-list (e.g. a category renamed in code) are cast;
// the UI shows them as-is rather than dropping the record.

type In<S extends z.ZodType> = z.output<S>;

export const experienceFromRow = (r: Tables<"experiences">): Experience => ({
  id: r.id, company: r.company, position: r.position, type: r.type, startDate: r.start_date, endDate: r.end_date,
  location: r.location, description: r.description, responsibilities: r.responsibilities,
  achievements: r.achievements, skills: r.skills, logo: r.logo,
});
export const experienceToRow = (v: In<typeof experienceSchema>): TablesInsert<"experiences"> => ({
  company: v.company, position: v.position, type: v.type, start_date: v.startDate, end_date: v.endDate,
  location: v.location, description: v.description, responsibilities: v.responsibilities,
  achievements: v.achievements, skills: v.skills, logo: v.logo,
});

export const educationFromRow = (r: Tables<"education">): Education => ({
  id: r.id, university: r.university, degree: r.degree, major: r.major, startDate: r.start_date, endDate: r.end_date,
  status: r.status as Education["status"], gpa: r.gpa, description: r.description, coursework: r.coursework,
  skills: r.skills, logo: r.logo,
});
export const educationToRow = (v: In<typeof educationSchema>): TablesInsert<"education"> => ({
  university: v.university, degree: v.degree, major: v.major, start_date: v.startDate, end_date: v.endDate,
  status: v.status, gpa: v.gpa, description: v.description, coursework: v.coursework, skills: v.skills, logo: v.logo,
});

export const skillFromRow = (r: Tables<"skills">): Skill => ({
  id: r.id, name: r.name, category: r.category as Skill["category"], level: r.level,
});
export const skillToRow = (v: In<typeof skillSchema>): TablesInsert<"skills"> => ({
  name: v.name, category: v.category, level: v.level,
});

export const achievementFromRow = (r: Tables<"achievements">): Achievement => ({
  id: r.id, title: r.title, organization: r.organization, date: r.date, description: r.description,
  category: r.category as Achievement["category"], pinned: r.pinned,
});
export const achievementToRow = (v: In<typeof achievementSchema>): TablesInsert<"achievements"> => ({
  title: v.title, organization: v.organization, date: v.date, description: v.description,
  category: v.category, pinned: v.pinned,
});

export const certificateFromRow = (r: Tables<"certificates">): Certificate => ({
  id: r.id, title: r.title, issuer: r.issuer, category: r.category as Certificate["category"],
  completionDate: r.completion_date, grade: r.grade, duration: r.duration, credentialId: r.credential_id,
  skills: r.skills, description: r.description, image: r.image, verified: r.verified, verifyUrl: r.verify_url,
});
export const certificateToRow = (v: In<typeof certificateSchema>): TablesInsert<"certificates"> => ({
  title: v.title, issuer: v.issuer, category: v.category, completion_date: v.completionDate, grade: v.grade,
  duration: v.duration, credential_id: v.credentialId, skills: v.skills, description: v.description,
  image: v.image, verified: v.verified, verify_url: v.verifyUrl,
});

export const categoryFromRow = (r: Tables<"portfolio_categories">, projectCount = 0): PortfolioCategory => ({
  id: r.id, name: r.name, slug: r.slug, description: r.description,
  color: r.color as PortfolioCategory["color"], projectCount,
});
export const categoryToRow = (v: In<typeof portfolioCategorySchema>): TablesInsert<"portfolio_categories"> => ({
  name: v.name, slug: v.slug, description: v.description, color: v.color,
});

type ProjectRow = Tables<"projects"> & { portfolio_categories: { name: string } | null };
export const projectFromRow = (r: ProjectRow): Project => ({
  id: r.id, title: r.title, categoryId: r.category_id, category: r.portfolio_categories?.name ?? "Uncategorized",
  shortDescription: r.short_description, description: r.description, technologies: r.technologies, tools: r.tools,
  image: r.image, problem: r.problem, objective: r.objective, methodology: r.methodology, results: r.results,
  status: r.status as Project["status"], link: r.link,
});
export const projectToRow = (v: In<typeof projectSchema>): TablesInsert<"projects"> => ({
  title: v.title, category_id: v.categoryId, short_description: v.shortDescription, description: v.description,
  technologies: v.technologies, tools: v.tools, image: v.image, problem: v.problem, objective: v.objective,
  methodology: v.methodology, results: v.results, status: v.status, link: v.link,
});

export const galleryFromRow = (r: Tables<"gallery_items">): GalleryItem => ({
  id: r.id, title: r.title, imageUrl: r.image_url, caption: r.caption,
  category: r.category as GalleryItem["category"], projectLink: r.project_link,
});
export const galleryToRow = (v: In<typeof galleryItemSchema>): TablesInsert<"gallery_items"> => ({
  title: v.title, image_url: v.imageUrl, caption: v.caption, category: v.category, project_link: v.projectLink,
});

export const paperFromRow = (r: Tables<"research_papers">): Paper => ({
  id: r.id, title: r.title, authors: r.authors, journal: r.journal, year: r.year, area: r.area,
  status: r.status as PaperStatus, abstract: r.abstract, keywords: r.keywords, doi: r.doi, url: r.url,
  pdfUrl: r.pdf_url, version: r.version, submissionDate: r.submission_date, preprintUrl: r.preprint_url,
});
export const paperToRow = (v: In<typeof paperSchema>): TablesInsert<"research_papers"> => ({
  title: v.title, authors: v.authors, journal: v.journal, year: v.year, area: v.area, status: v.status,
  abstract: v.abstract, keywords: v.keywords, doi: v.doi, url: v.url, pdf_url: v.pdfUrl, version: v.version,
  submission_date: v.submissionDate, preprint_url: v.preprintUrl,
});

export const upcomingFromRow = (r: Tables<"upcoming_research">): UpcomingResearch => ({
  id: r.id, title: r.title, area: r.area, status: r.status as UpcomingResearch["status"],
  expectedYear: r.expected_year, question: r.question, contribution: r.contribution,
  methodology: r.methodology, keywords: r.keywords,
});
export const upcomingToRow = (v: In<typeof upcomingSchema>): TablesInsert<"upcoming_research"> => ({
  title: v.title, area: v.area, status: v.status, expected_year: v.expectedYear, question: v.question,
  contribution: v.contribution, methodology: v.methodology, keywords: v.keywords,
});

export const languageFromRow = (r: Tables<"languages">): Language => ({
  id: r.id, name: r.name, flag: r.flag, level: r.level, proficiency: r.proficiency,
});
export const languageToRow = (v: In<typeof languageSchema>): TablesInsert<"languages"> => ({
  name: v.name, flag: v.flag, level: v.level, proficiency: v.proficiency,
});

export const ebookFromRow = (r: Tables<"ebooks">, downloads = 0): EBook => ({
  id: r.id, title: r.title, subtitle: r.subtitle, author: r.author, image: r.cover, category: r.category,
  pages: r.pages, year: r.year, isbn: r.isbn, description: r.description, fileUrl: r.file_url, downloads,
});
export const ebookToRow = (v: In<typeof ebookSchema>): TablesInsert<"ebooks"> => ({
  title: v.title, subtitle: v.subtitle, author: v.author, cover: v.image, category: v.category, pages: v.pages,
  year: v.year, isbn: v.isbn, description: v.description, file_url: v.fileUrl,
});
