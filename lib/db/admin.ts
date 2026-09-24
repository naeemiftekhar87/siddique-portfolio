import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseSecretKey, supabaseUrl } from "./env";

/**
 * Privileged client (secret key, bypasses RLS). Only call it after
 * the admin session is verified (getAdminUser/requireAdmin), or from server-owned flows such as
 * rate limiting and the download counter.
 */
export function createAdminClient() {
  return createClient<Database>(supabaseUrl(), supabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
