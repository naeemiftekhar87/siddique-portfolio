import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/db/admin";
import { keyedHash } from "./hash";

/** Best-effort client address from the proxy headers set by Vercel. */
export async function clientAddress() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Counts one hit for `subject` in a fixed window, stored in Supabase so it
 * holds across serverless instances. Returns false once the limit is passed.
 * Only a keyed hash of the subject is stored.
 */
export async function hitRateLimit(scope: string, subject: string, limit: number, windowSeconds: number) {
  const { data, error } = await createAdminClient().rpc("hit_rate_limit", {
    p_key: `${scope}:${keyedHash(subject)}`,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error(`[rate-limit] ${scope}: ${error.message}`);
    // Fail closed: without a working limiter, refuse rather than allow floods.
    return false;
  }
  return data <= limit;
}
