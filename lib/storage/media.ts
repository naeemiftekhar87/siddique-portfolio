import "server-only";
import { randomUUID } from "node:crypto";
import type { Tables } from "@/lib/db/database.types";
import { createAdminClient } from "@/lib/db/admin";

export type MediaAsset = {
  id: number;
  name: string;
  type: "image" | "document";
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
};

type Rule = { bucket: "images" | "documents"; type: MediaAsset["type"]; ext: string; maxBytes: number; sniff: (b: Uint8Array) => boolean };

const ascii = (b: Uint8Array, start: number, text: string) =>
  text.split("").every((ch, i) => b[start + i] === ch.charCodeAt(0));

const IMAGE_MAX = 5 * 1024 * 1024;
const PDF_MAX = 50 * 1024 * 1024;

/** Accepted uploads. The file's leading bytes must match its declared type. */
const uploadRules: Record<string, Rule> = {
  "image/jpeg": { bucket: "images", type: "image", ext: "jpg", maxBytes: IMAGE_MAX, sniff: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { bucket: "images", type: "image", ext: "png", maxBytes: IMAGE_MAX, sniff: (b) => b[0] === 0x89 && ascii(b, 1, "PNG") },
  "image/gif": { bucket: "images", type: "image", ext: "gif", maxBytes: IMAGE_MAX, sniff: (b) => ascii(b, 0, "GIF8") },
  "image/webp": { bucket: "images", type: "image", ext: "webp", maxBytes: IMAGE_MAX, sniff: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "WEBP") },
  "image/avif": { bucket: "images", type: "image", ext: "avif", maxBytes: IMAGE_MAX, sniff: (b) => ascii(b, 4, "ftypavi") },
  "application/pdf": { bucket: "documents", type: "document", ext: "pdf", maxBytes: PDF_MAX, sniff: (b) => ascii(b, 0, "%PDF-") },
};

const mediaFromRow = (r: Tables<"media_assets">): MediaAsset => ({
  id: r.id, name: r.name, type: r.type as MediaAsset["type"], mimeType: r.mime_type,
  size: r.size_bytes, url: r.url, createdAt: r.created_at,
});

export class UploadError extends Error {}

const ruleFor = (mimeType: string) => {
  const rule = uploadRules[mimeType];
  if (!rule) throw new UploadError("Unsupported file type. Upload a JPG, PNG, WebP, GIF, AVIF image or a PDF.");
  return rule;
};
const tooLarge = (rule: Rule) => new UploadError(`File is too large; the limit is ${rule.maxBytes / 1024 / 1024} MB for this type.`);

/**
 * Step 1 of an upload: validate the declared file and hand out a one-time
 * signed URL, so the browser sends the bytes straight to Supabase Storage
 * (serverless request bodies are capped at a few MB, far below 50 MB PDFs).
 */
export async function createUploadTarget(file: { type: string; size: number }) {
  const rule = ruleFor(file.type);
  if (!(file.size > 0)) throw new UploadError("The file is empty.");
  if (file.size > rule.maxBytes) throw tooLarge(rule);
  const path = `${new Date().getUTCFullYear()}/${randomUUID()}.${rule.ext}`;
  const { data, error } = await createAdminClient().storage.from(rule.bucket).createSignedUploadUrl(path);
  if (error || !data) {
    console.error(`[media] signed upload URL failed: ${error?.message}`);
    throw new Error("Upload failed.");
  }
  return { bucket: rule.bucket, path: data.path, token: data.token };
}

const pathPattern = /^\d{4}\/[0-9a-f-]{36}\.(jpg|png|gif|webp|avif|pdf)$/;

/**
 * Step 2: after the browser uploaded, check what actually landed in Storage
 * (declared type, size limit, leading bytes) and record it in the media
 * library. Anything that fails a check is deleted from Storage.
 */
export async function finalizeUpload(input: { bucket: string; path: string; name: string }): Promise<MediaAsset> {
  if (!pathPattern.test(input.path)) throw new UploadError("Invalid upload.");
  const db = createAdminClient();
  const storage = db.storage.from(input.bucket);
  const reject = async (message: string) => {
    await storage.remove([input.path]);
    return new UploadError(message);
  };

  const { data: info, error: infoError } = await storage.info(input.path);
  if (infoError || !info) throw new UploadError("The upload did not complete. Please try again.");
  const rule = uploadRules[info.contentType ?? ""];
  if (!rule || rule.bucket !== input.bucket || !input.path.endsWith(`.${rule.ext}`)) throw await reject("Unsupported file type.");
  const size = info.size ?? 0;
  if (size > rule.maxBytes) throw await reject(tooLarge(rule).message);

  const url = storage.getPublicUrl(input.path).data.publicUrl;
  const head = await fetch(url, { headers: { Range: "bytes=0-15" }, cache: "no-store" });
  const bytes = new Uint8Array(await head.arrayBuffer());
  if (!head.ok || !rule.sniff(bytes)) throw await reject("The file content does not match its type.");

  const name = input.name.replace(/[^\w.\- ()]/g, "_").slice(0, 200) || `upload.${rule.ext}`;
  const { data, error } = await db
    .from("media_assets")
    .insert({ bucket: rule.bucket, path: input.path, url, name, type: rule.type, mime_type: info.contentType!, size_bytes: size })
    .select()
    .single();
  if (error) {
    await storage.remove([input.path]);
    console.error(`[media] record failed: ${error.message}`);
    throw new Error("Upload failed.");
  }
  return mediaFromRow(data);
}

/** Content that still points at a media URL, as readable labels. */
export async function findMediaReferences(url: string): Promise<string[]> {
  const db = createAdminClient();
  const checks = await Promise.all([
    db.from("experiences").select("company").eq("logo", url),
    db.from("education").select("university").eq("logo", url),
    db.from("certificates").select("title").eq("image", url),
    db.from("projects").select("title").eq("image", url),
    db.from("gallery_items").select("title").eq("image_url", url),
    db.from("ebooks").select("title").or(`cover.eq."${url}",file_url.eq."${url}"`),
    db.from("research_papers").select("title").eq("pdf_url", url),
    db.from("site_settings").select("key").eq("key", "profile").eq("value->>photo", url),
  ]);
  const labels = ["Experience", "Education", "Certificate", "Project", "Gallery", "eBook", "Paper", "Profile photo"];
  const refs: string[] = [];
  checks.forEach((result, i) => {
    if (result.error) throw new Error(result.error.message);
    for (const row of result.data ?? []) {
      const name = Object.values(row)[0];
      refs.push(labels[i] === "Profile photo" ? "Profile photo" : `${labels[i]} “${String(name)}”`);
    }
  });
  return refs;
}

/** Every file in the media library, newest first (admin only). */
export async function getMediaAssets(): Promise<MediaAsset[]> {
  const { data, error } = await createAdminClient().from("media_assets").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load media: ${error.message}`);
  return data.map(mediaFromRow);
}
