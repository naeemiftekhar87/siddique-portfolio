import type { Paper } from "./schemas";

/** Sections of /research, selectable with ?tab= so the view is shareable. */
export const researchSections = [
  { id: "interests", label: "Research Interests" },
  { id: "published", label: "Published Research" },
  { id: "upcoming", label: "Upcoming Topics" },
] as const;

export type ResearchSectionId = (typeof researchSections)[number]["id"];

export const isResearchSectionId = (v: unknown): v is ResearchSectionId =>
  researchSections.some((s) => s.id === v);

/** Link for "Read Paper": the paper's own URL, else its DOI. */
export const paperLink = (p: Pick<Paper, "url" | "doi">) =>
  p.url || (p.doi ? `https://doi.org/${p.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")}` : "");
