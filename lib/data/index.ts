/**
 * Client-safe data exports: entity types and fixed pick-lists. Content
 * itself lives in Supabase and is read on the server through
 * lib/data/queries.ts; the placeholder seed used during Phases 1–4 is gone
 * (the database starts empty; the owner enters everything in the admin).
 */
export * from "./constants";
export type {
  AboutSettings,
  Achievement,
  Certificate,
  ColorSettings,
  EBook,
  Education,
  Experience,
  FooterSettings,
  GalleryItem,
  HomeSettings,
  Language,
  LinksSettings,
  NavLink,
  NavigationSettings,
  Paper,
  PortfolioCategory,
  ProfileSettings,
  Project,
  ResearchProfileSettings,
  ResumeConfig,
  Skill,
  UpcomingResearch,
} from "./schemas";
export type { SiteProfile } from "./queries";
