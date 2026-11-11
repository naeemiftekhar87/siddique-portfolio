import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSessionClient } from "@/lib/db/server";
import { SESSION_COOKIE, isSessionCookieValid } from "./session-cookie";
import { RECOVERY_COOKIE } from "./flow-cookie";
import { hasRequiredAssurance } from "./mfa";

export const isAdmin = (user: Pick<User, "app_metadata"> | null | undefined) => user?.app_metadata?.role === "admin";

/**
 * The signed-in admin, verified with the Supabase Auth server, or null.
 * Cached per request so layouts, pages and actions share one lookup.
 */
export const getAdminUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  if (cookieStore.has(RECOVERY_COOKIE)) return null;
  if (!cookieStore.has(SESSION_COOKIE)) return null;
  const supabase = await createSessionClient();
  const claims = await supabase.auth.getClaims();
  if (claims.error || !isSessionCookieValid(cookieStore.get(SESSION_COOKIE)?.value, claims.data?.claims.session_id)) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !isAdmin(data.user)) return null;
  if (!(await hasRequiredAssurance(data.user!))) return null;
  return data.user;
});

/** Guard for admin pages and Server Actions: redirects to the login page. */
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
