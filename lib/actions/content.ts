"use server";

import { z } from "zod";
import {
  achievementFromRow, achievementToRow, categoryFromRow, categoryToRow, certificateFromRow, certificateToRow,
  ebookFromRow, ebookToRow, educationFromRow, educationToRow, experienceFromRow, experienceToRow,
  galleryFromRow, galleryToRow, languageFromRow, languageToRow, paperFromRow, paperToRow, projectFromRow,
  projectToRow, skillFromRow, skillToRow, upcomingFromRow, upcomingToRow,
} from "@/lib/data/mappers";
import {
  achievementSchema, certificateSchema, ebookSchema, educationSchema, experienceSchema, galleryItemSchema,
  languageSchema, paperSchema, portfolioCategorySchema, projectSchema, skillSchema, upcomingSchema,
} from "@/lib/data/schemas";
import { check, mutate, type AdminClient } from "./helpers";

// Admin CRUD. Every action verifies the admin session, validates with zod,
// writes with the privileged client, and revalidates the public site
// (see mutate() in ./helpers.ts). A save with an id updates; without, inserts.

const idSchema = z.number().int().positive();

// Table names are listed explicitly so each delete stays fully typed.
async function remove(
  table:
    | "experiences" | "education" | "skills" | "achievements" | "certificates" | "portfolio_categories"
    | "projects" | "gallery_items" | "research_papers" | "upcoming_research" | "languages" | "ebooks",
  label: string,
  id: unknown,
) {
  return mutate(idSchema, id, async (value, db) => {
    check(label, await db.from(table).delete().eq("id", value).select("id").single());
    return value;
  });
}

export async function saveExperience(input: unknown) {
  return mutate(experienceSchema, input, async (v, db) => {
    const row = experienceToRow(v);
    const q = v.id
      ? db.from("experiences").update(row).eq("id", v.id)
      : db.from("experiences").insert({ ...row, sort_order: await topSortOrder(db, "experiences") });
    return experienceFromRow(check("experience entry", await q.select().single()));
  });
}
export async function deleteExperience(id: number) { return remove("experiences", "experience entry", id); }

export async function saveEducation(input: unknown) {
  return mutate(educationSchema, input, async (v, db) => {
    const row = educationToRow(v);
    const q = v.id
      ? db.from("education").update(row).eq("id", v.id)
      : db.from("education").insert({ ...row, sort_order: await topSortOrder(db, "education") });
    return educationFromRow(check("education entry", await q.select().single()));
  });
}
export async function deleteEducation(id: number) { return remove("education", "education entry", id); }

export async function saveSkill(input: unknown) {
  return mutate(skillSchema, input, async (v, db) => {
    const row = skillToRow(v);
    const q = v.id ? db.from("skills").update(row).eq("id", v.id) : db.from("skills").insert(row);
    return skillFromRow(check("skill", await q.select().single()));
  });
}
export async function deleteSkill(id: number) { return remove("skills", "skill", id); }

export async function saveAchievement(input: unknown) {
  return mutate(achievementSchema, input, async (v, db) => {
    const row = achievementToRow(v);
    const q = v.id ? db.from("achievements").update(row).eq("id", v.id) : db.from("achievements").insert(row);
    return achievementFromRow(check("achievement", await q.select().single()));
  });
}
export async function deleteAchievement(id: number) { return remove("achievements", "achievement", id); }

export async function saveCertificate(input: unknown) {
  return mutate(certificateSchema, input, async (v, db) => {
    const row = certificateToRow(v);
    const q = v.id ? db.from("certificates").update(row).eq("id", v.id) : db.from("certificates").insert(row);
    return certificateFromRow(check("certificate", await q.select().single()));
  });
}
export async function deleteCertificate(id: number) { return remove("certificates", "certificate", id); }

export async function savePortfolioCategory(input: unknown) {
  return mutate(portfolioCategorySchema, input, async (v, db) => {
    const row = categoryToRow(v);
    if (v.id) {
      const saved = check("category", await db.from("portfolio_categories").update(row).eq("id", v.id).select().single());
      const { count } = await db.from("projects").select("id", { count: "exact", head: true }).eq("category_id", v.id);
      return categoryFromRow(saved, count ?? 0);
    }
    // New categories go to the end of the list.
    const { data: last } = await db
      .from("portfolio_categories").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const saved = check("category", await db
      .from("portfolio_categories").insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 }).select().single());
    return categoryFromRow(saved, 0);
  });
}
export async function deletePortfolioCategory(id: number) { return remove("portfolio_categories", "category", id); }

/** Saves a list order shown in the admin (ids from first to last). */
async function reorder(table: "portfolio_categories" | "experiences" | "education", label: string, ids: unknown) {
  return mutate(z.array(idSchema).max(500), ids, async (order, db) => {
    await Promise.all(
      order.map(async (id, index) =>
        check(label, await db.from(table).update({ sort_order: index }).eq("id", id).select("id").single()),
      ),
    );
    return order;
  });
}

export async function reorderPortfolioCategories(ids: number[]) { return reorder("portfolio_categories", "category", ids); }
export async function reorderExperiences(ids: number[]) { return reorder("experiences", "experience entry", ids); }
export async function reorderEducation(ids: number[]) { return reorder("education", "education entry", ids); }

/** sort_order that places a new row at the top of an ordered list. */
async function topSortOrder(db: AdminClient, table: "experiences" | "education") {
  const { data } = await db.from(table).select("sort_order").order("sort_order").limit(1).maybeSingle();
  return (data?.sort_order ?? 1) - 1;
}

export async function saveProject(input: unknown) {
  return mutate(projectSchema, input, async (v, db) => {
    const row = projectToRow(v);
    const q = v.id ? db.from("projects").update(row).eq("id", v.id) : db.from("projects").insert(row);
    return projectFromRow(check("project", await q.select("*, portfolio_categories(name)").single()));
  });
}
export async function deleteProject(id: number) { return remove("projects", "project", id); }

export async function saveGalleryItem(input: unknown) {
  return mutate(galleryItemSchema, input, async (v, db) => {
    const row = galleryToRow(v);
    const q = v.id ? db.from("gallery_items").update(row).eq("id", v.id) : db.from("gallery_items").insert(row);
    return galleryFromRow(check("gallery item", await q.select().single()));
  });
}
export async function deleteGalleryItem(id: number) { return remove("gallery_items", "gallery item", id); }

export async function savePaper(input: unknown) {
  return mutate(paperSchema, input, async (v, db) => {
    const row = paperToRow(v);
    const q = v.id ? db.from("research_papers").update(row).eq("id", v.id) : db.from("research_papers").insert(row);
    return paperFromRow(check("paper", await q.select().single()));
  });
}
export async function deletePaper(id: number) { return remove("research_papers", "paper", id); }

export async function saveUpcomingResearch(input: unknown) {
  return mutate(upcomingSchema, input, async (v, db) => {
    const row = upcomingToRow(v);
    const q = v.id ? db.from("upcoming_research").update(row).eq("id", v.id) : db.from("upcoming_research").insert(row);
    return upcomingFromRow(check("research topic", await q.select().single()));
  });
}
export async function deleteUpcomingResearch(id: number) { return remove("upcoming_research", "research topic", id); }

export async function saveLanguage(input: unknown) {
  return mutate(languageSchema, input, async (v, db) => {
    const row = languageToRow(v);
    const q = v.id ? db.from("languages").update(row).eq("id", v.id) : db.from("languages").insert(row);
    return languageFromRow(check("language", await q.select().single()));
  });
}
export async function deleteLanguage(id: number) { return remove("languages", "language", id); }

export async function saveEbook(input: unknown) {
  return mutate(ebookSchema, input, async (v, db) => {
    const row = ebookToRow(v);
    const q = v.id ? db.from("ebooks").update(row).eq("id", v.id) : db.from("ebooks").insert(row);
    return ebookFromRow(check("eBook", await q.select().single()));
  });
}
export async function deleteEbook(id: number) { return remove("ebooks", "eBook", id); }
