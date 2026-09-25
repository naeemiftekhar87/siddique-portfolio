import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { dataCacheHeaders, supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Read-only client for public pages. Uses the publishable key without a
 * session, so Row Level Security limits it to the public SELECT policies.
 */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: dataCacheHeaders },
  });
}
