"use client";

/** Longest side, in pixels, of an uploaded photo after optimisation. */
const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 0.85;
/** Types that are resized and re-encoded; GIF (may be animated) and AVIF pass through. */
const OPTIMISABLE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Resizes large photos and converts them to WebP in the browser before upload
 * (phases.md 6.6, P1). Returns the original file when it is not optimisable,
 * when the browser cannot encode WebP, or when the result is not smaller.
 */
export async function optimizeImage(file: File): Promise<File> {
  if (!OPTIMISABLE.includes(file.type) || typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
    // Some browsers fall back to PNG when WebP encoding is unsupported.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp", lastModified: file.lastModified });
  } catch {
    return file;
  }
}
