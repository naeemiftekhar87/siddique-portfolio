"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/db/admin";
import { getAdminUser } from "@/lib/auth/session";
import { findMediaReferences, getMediaAssets, type MediaAsset } from "@/lib/storage/media";
import { check, mutate, UserError } from "./helpers";
import { fail, ok, unauthenticated, type ActionResult } from "./result";

/** Media library files of one type, newest first (for the picker in admin forms). */
export async function listMedia(type: MediaAsset["type"]): Promise<ActionResult<MediaAsset[]>> {
  if (!(await getAdminUser())) return unauthenticated();
  if (type !== "image" && type !== "document") return fail("Unknown file type.");
  try {
    return ok((await getMediaAssets()).filter((m) => m.type === type));
  } catch {
    return fail("Could not load the media library.");
  }
}

/** Deletes a file from Storage and the media library, unless content still uses it. */
export async function deleteMedia(id: number) {
  return mutate(z.number().int().positive(), id, async (value, db) => {
    const asset = check("file", await db.from("media_assets").select("*").eq("id", value).single());
    const refs = await findMediaReferences(asset.url);
    if (refs.length > 0) {
      throw new UserError(`Still used by ${refs.slice(0, 3).join(", ")}${refs.length > 3 ? ` and ${refs.length - 3} more` : ""}. Remove it there first.`);
    }
    const { error } = await createAdminClient().storage.from(asset.bucket).remove([asset.path]);
    if (error) throw new Error(error.message);
    check("file", await db.from("media_assets").delete().eq("id", value).select("id").single());
    return value;
  });
}
