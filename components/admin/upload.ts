"use client";

import { createClient } from "@supabase/supabase-js";
import type { MediaAsset } from "@/lib/storage/media";
import { optimizeImage } from "./optimize-image";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function postJson<T>(url: string, body: unknown): Promise<Result<T>> {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return (await response.json().catch(() => ({ ok: false, error: "Upload failed. Please try again." }))) as Result<T>;
}

/**
 * Uploads one file to the media library: the server validates it and issues a
 * signed URL, the browser sends the bytes straight to Supabase Storage (no
 * size cap from the app server), then the server verifies and records it.
 * Photos are resized and converted to WebP first (optimize-image.ts).
 */
export async function uploadMedia(original: File): Promise<Result<MediaAsset>> {
  try {
    const file = await optimizeImage(original);
    const target = await postJson<{ bucket: string; path: string; token: string }>("/api/media/sign", { type: file.type, size: file.size });
    if (!target.ok) return target;

    const storage = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    }).storage;
    const { error } = await storage
      .from(target.data.bucket)
      .uploadToSignedUrl(target.data.path, target.data.token, file, { contentType: file.type, cacheControl: "31536000" });
    if (error) return { ok: false, error: error.message.includes("size") ? "File is too large." : "Upload failed. Please try again." };

    return await postJson<MediaAsset>("/api/media", { bucket: target.data.bucket, path: target.data.path, name: file.name });
  } catch {
    return { ok: false, error: "Upload failed. Check your connection and try again." };
  }
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
