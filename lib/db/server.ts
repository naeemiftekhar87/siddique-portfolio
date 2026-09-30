import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";
import { capSupabaseCookie, supabaseCookieOptions } from "@/lib/auth/session-cookie";

/**
 * Cookie-aware client carrying the admin's Supabase Auth session. Used for
 * sign-in, sign-out, password changes and session checks; content writes use
 * createAdminClient() after the session is verified.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, capSupabaseCookie(options)));
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // proxy refreshes the session cookies on the next request.
        }
      },
    },
  });
}
