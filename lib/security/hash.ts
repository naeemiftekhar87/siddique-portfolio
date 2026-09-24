import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseSecretKey } from "@/lib/db/env";

/** Keyed hash so raw identifiers (such as IP addresses) are never stored. */
export function keyedHash(value: string) {
  return createHmac("sha256", supabaseSecretKey()).update(value).digest("base64url");
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
