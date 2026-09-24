import "server-only";
import { createAdminClient } from "@/lib/db/admin";

type ActivityType = "add" | "update";
export type Activity = { action: string; detail: string; at: string; type: ActivityType };
export type DownloadPoint = { date: string; resume: number; ebook: number };

// Tables shown on the dashboard, with the column used as each item's name.
const sections = [
  { table: "experiences", label: "Experience", name: "position" },
  { table: "education", label: "Education", name: "degree" },
  { table: "skills", label: "Skills", name: "name" },
  { table: "certificates", label: "Certificates", name: "title" },
  { table: "projects", label: "Projects", name: "title" },
  { table: "research_papers", label: "Papers", name: "title" },
  { table: "ebooks", label: "eBooks", name: "title" },
  { table: "achievements", label: "Achievements", name: "title" },
] as const;

/** Dashboard data: counts per section, the 5 latest content changes, and 30 days of downloads. */
export async function getDashboardData() {
  const db = createAdminClient();

  const counts = await Promise.all(
    sections.map(async (s) => {
      const { count, error } = await db.from(s.table).select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return { section: s.label, table: s.table, count: count ?? 0 };
    }),
  );

  // Recent activity comes from the content tables' own timestamps; there is
  // no separate activity log.
  const recent = await Promise.all(
    sections.map(async (s) => {
      const { data, error } = await db
        .from(s.table)
        .select(`${s.name}, created_at, updated_at`)
        .order("updated_at", { ascending: false })
        .limit(5);
      if (error) throw new Error(error.message);
      return (data as unknown as Record<string, string>[]).map((row): Activity => {
        const isNew = Math.abs(Date.parse(row.updated_at) - Date.parse(row.created_at)) < 2000;
        return {
          action: `${isNew ? "Added" : "Updated"} ${s.label === "Skills" ? "skill" : s.label.replace(/s$/, "").toLowerCase()}`,
          detail: row[s.name],
          at: row.updated_at,
          type: isNew ? "add" : "update",
        };
      });
    }),
  );
  const activity = recent.flat().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5);

  const since = new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10);
  const { data: stats, error } = await db.from("download_stats").select("day, kind, count").gte("day", since);
  if (error) throw new Error(error.message);
  const byDay = new Map<string, DownloadPoint>();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    byDay.set(date, { date, resume: 0, ebook: 0 });
  }
  for (const s of stats ?? []) {
    const point = byDay.get(s.day);
    if (!point) continue;
    if (s.kind === "ebook") point.ebook += s.count;
    else point.resume += s.count;
  }

  return { counts, activity, downloads: [...byDay.values()] };
}
