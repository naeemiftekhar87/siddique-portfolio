import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/db/admin";
import { createPublicClient } from "@/lib/db/public";
import {
  achievementFromRow,
  categoryFromRow,
  certificateFromRow,
  ebookFromRow,
  educationFromRow,
  experienceFromRow,
  galleryFromRow,
  languageFromRow,
  paperFromRow,
  projectFromRow,
  skillFromRow,
  upcomingFromRow,
} from "./mappers";
import { parseSettings, type SettingsKey, type SettingsValue } from "./settings";

/**
 * Server-side reads for public pages and admin screens. Public content is
 * read with the publishable key (RLS read-only policies). Results are
 * deduplicated per request with React cache(); public pages are re-rendered
 * after admin writes via revalidatePath (lib/actions/revalidate.ts).
 */

function unwrap<T>(label: string, result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) {
    console.error(`[data] ${label}: ${result.error.message}`);
    throw new Error(`Could not load ${label}.`);
  }
  return result.data as T;
}

// ─── Settings ────────────────────────────────────────────────────────────────

const getAllSettings = cache(async () => {
  const rows = unwrap("site settings", await createPublicClient().from("site_settings").select("key, value"));
  return new Map(rows.map((r) => [r.key, r.value]));
});

export async function getSettings<K extends SettingsKey>(key: K): Promise<SettingsValue<K>> {
  const all = await getAllSettings();
  return parseSettings(key, all.get(key));
}

/**
 * The profile as the public pages use it: identity and hero stats (Profile),
 * links (Settings), Scholar metrics and bio (Research Profile), and interests.
 */
export const getSiteProfile = cache(async () => {
  const [profile, links, research, interests] = await Promise.all([
    getSettings("profile"),
    getSettings("links"),
    getSettings("research_profile"),
    getSettings("research_interests"),
  ]);
  return {
    ...profile,
    ...links,
    researchInterests: interests.items,
    scholarMetrics: {
      citations: research.citations,
      hIndex: research.hIndex,
      i10Index: research.i10Index,
      publications: research.publications,
    },
    researchBio: research.bio,
  };
});

export type SiteProfile = Awaited<ReturnType<typeof getSiteProfile>>;

// ─── Collections ─────────────────────────────────────────────────────────────

export const getExperiences = cache(async () =>
  unwrap(
    "experience",
    await createPublicClient().from("experiences").select("*").order("sort_order").order("id", { ascending: false }),
  ).map(experienceFromRow),
);

export const getEducation = cache(async () =>
  unwrap(
    "education",
    await createPublicClient().from("education").select("*").order("sort_order").order("id", { ascending: false }),
  ).map(educationFromRow),
);

export const getSkills = cache(async () =>
  unwrap("skills", await createPublicClient().from("skills").select("*").order("id")).map(skillFromRow),
);

export const getAchievements = cache(async () =>
  unwrap(
    "achievements",
    await createPublicClient().from("achievements").select("*").order("id", { ascending: false }),
  ).map(achievementFromRow),
);

export const getCertificates = cache(async () =>
  unwrap(
    "certificates",
    await createPublicClient().from("certificates").select("*").order("id", { ascending: false }),
  ).map(certificateFromRow),
);

export const getCertificate = cache(async (id: number) => {
  const row = unwrap("certificate", await createPublicClient().from("certificates").select("*").eq("id", id).maybeSingle());
  return row ? certificateFromRow(row) : null;
});

export const getPortfolioCategories = cache(async () => {
  const supabase = createPublicClient();
  const [cats, projects] = await Promise.all([
    supabase.from("portfolio_categories").select("*").order("sort_order").order("id"),
    supabase.from("projects").select("category_id"),
  ]);
  const counts = new Map<number, number>();
  for (const p of unwrap("projects", projects)) {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }
  return unwrap("portfolio categories", cats).map((c) => categoryFromRow(c, counts.get(c.id) ?? 0));
});

const projectSelect = "*, portfolio_categories(name)";

export const getProjects = cache(async () =>
  unwrap(
    "projects",
    await createPublicClient().from("projects").select(projectSelect).order("id", { ascending: false }),
  ).map(projectFromRow),
);

export const getProject = cache(async (id: number) => {
  const row = unwrap("project", await createPublicClient().from("projects").select(projectSelect).eq("id", id).maybeSingle());
  return row ? projectFromRow(row) : null;
});

export const getGalleryItems = cache(async () =>
  unwrap(
    "gallery",
    await createPublicClient().from("gallery_items").select("*").order("id", { ascending: false }),
  ).map(galleryFromRow),
);

export const getPapers = cache(async () =>
  unwrap(
    "research papers",
    await createPublicClient()
      .from("research_papers")
      .select("*")
      .order("year", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false }),
  ).map(paperFromRow),
);

export const getPaper = cache(async (id: number) => {
  const row = unwrap("paper", await createPublicClient().from("research_papers").select("*").eq("id", id).maybeSingle());
  return row ? paperFromRow(row) : null;
});

export const getUpcomingResearch = cache(async () =>
  unwrap(
    "upcoming research",
    await createPublicClient().from("upcoming_research").select("*").order("id", { ascending: false }),
  ).map(upcomingFromRow),
);

export const getLanguages = cache(async () =>
  unwrap("languages", await createPublicClient().from("languages").select("*").order("id")).map(languageFromRow),
);

/** Total downloads per eBook id (the stats table is server-only, so the secret key is used). */
const getEbookDownloadCounts = cache(async () => {
  const rows = unwrap(
    "download counts",
    await createAdminClient().from("download_stats").select("target_id, count").eq("kind", "ebook"),
  );
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.target_id, (totals.get(r.target_id) ?? 0) + r.count);
  return totals;
});

export const getEbooks = cache(async () => {
  const [rows, downloads] = await Promise.all([
    createPublicClient().from("ebooks").select("*").order("id", { ascending: false }),
    getEbookDownloadCounts(),
  ]);
  return unwrap("eBooks", rows).map((r) => ebookFromRow(r, downloads.get(String(r.id)) ?? 0));
});

export const getEbook = cache(async (id: number) => {
  const [row, downloads] = await Promise.all([
    createPublicClient().from("ebooks").select("*").eq("id", id).maybeSingle(),
    getEbookDownloadCounts(),
  ]);
  const data = unwrap("eBook", row);
  return data ? ebookFromRow(data, downloads.get(String(data.id)) ?? 0) : null;
});

/** Parses a route [id] segment; null for anything that is not a positive integer. */
export function parseId(raw: string) {
  return /^\d{1,15}$/.test(raw) && Number(raw) > 0 ? Number(raw) : null;
}
