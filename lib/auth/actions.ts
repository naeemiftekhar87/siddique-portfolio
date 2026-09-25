"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createAdminClient } from "@/lib/db/admin";
import { supabasePublishableKey, supabaseUrl } from "@/lib/db/env";
import { createSessionClient } from "@/lib/db/server";
import { clientAddress, hitRateLimit } from "@/lib/security/rate-limit";
import { fail, ok, unauthenticated, validationMessage, type ActionResult } from "@/lib/actions/result";
import { getAdminUser, isAdmin } from "./session";
import { SESSION_COOKIE, createSessionCookieValue, sessionCookieOptions } from "./session-cookie";

// Brute-force protection on top of Supabase Auth's own limits: at most
// 10 attempts per 15 minutes per client address and per email address.
const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_SECONDS = 15 * 60;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.").max(256),
});

export async function login(input: { email: string; password: string }): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Enter your email and password.");
  const { email, password } = parsed.data;

  const [byAddress, byEmail] = await Promise.all([
    hitRateLimit("login-ip", await clientAddress(), LOGIN_LIMIT, LOGIN_WINDOW_SECONDS),
    hitRateLimit("login-email", email, LOGIN_LIMIT, LOGIN_WINDOW_SECONDS),
  ]);
  if (!byAddress || !byEmail) return fail("Too many sign-in attempts. Please wait 15 minutes and try again.");

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return fail("Incorrect email or password.");
  if (!isAdmin(data.user)) {
    await supabase.auth.signOut();
    return fail("Incorrect email or password.");
  }

  (await cookies()).set(SESSION_COOKIE, createSessionCookieValue(), sessionCookieOptions);
  // The login form navigates to /admin itself. A redirect() here would throw
  // NEXT_REDIRECT into the form's try/catch and flash a false error.
  return ok(null);
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(12, "New password must be at least 12 characters.").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { message: "Passwords do not match.", path: ["confirm"] })
  .refine((v) => v.next !== v.current, { message: "Choose a password different from the current one.", path: ["next"] });

export async function changePassword(input: z.input<typeof passwordSchema>): Promise<ActionResult> {
  const user = await getAdminUser();
  if (!user) return unauthenticated();
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? validationMessage(parsed.error));

  if (!(await hitRateLimit("password-change", user.id, 5, LOGIN_WINDOW_SECONDS))) {
    return fail("Too many attempts. Please wait 15 minutes and try again.");
  }

  // Confirm the current password with a throwaway client so the admin's
  // own session cookies are not touched.
  const verifier = createClient(supabaseUrl(), supabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: verifyError } = await verifier.auth.signInWithPassword({
    email: user.email ?? "",
    password: parsed.data.current,
  });
  if (verifyError) return fail("Current password is incorrect.");
  await verifier.auth.signOut();

  const { error } = await createAdminClient().auth.admin.updateUserById(user.id, { password: parsed.data.next });
  if (error) {
    console.error(`[auth] password change failed: ${error.message}`);
    return fail("Could not update the password. Please try again.");
  }
  return ok(null);
}
