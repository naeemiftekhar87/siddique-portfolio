"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createAdminClient } from "@/lib/db/admin";
import { supabasePublishableKey, supabaseUrl } from "@/lib/db/env";
import { createSessionClient } from "@/lib/db/server";
import { clientAddress, hitRateLimit } from "@/lib/security/rate-limit";
import { escapeHtml, sendEmail } from "@/lib/email/resend";
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

/**
 * Confirms the admin's current password with a throwaway client, so the
 * admin's own session cookies are not touched.
 */
async function isCurrentPassword(email: string, password: string) {
  const verifier = createClient(supabaseUrl(), supabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await verifier.auth.signInWithPassword({ email, password });
  if (error) return false;
  await verifier.auth.signOut();
  return true;
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

  if (!(await isCurrentPassword(user.email ?? "", parsed.data.current))) return fail("Current password is incorrect.");

  const { error } = await createAdminClient().auth.admin.updateUserById(user.id, { password: parsed.data.next });
  if (error) {
    console.error(`[auth] password change failed: ${error.message}`);
    return fail("Could not update the password. Please try again.");
  }
  return ok(null);
}

const emailSchema = z
  .object({
    newEmail: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
    confirmEmail: z.string().trim().toLowerCase(),
    password: z.string().min(1, "Enter your current password."),
  })
  .refine((v) => v.newEmail === v.confirmEmail, { message: "The email addresses do not match.", path: ["confirmEmail"] });

/**
 * Changes the admin's sign-in email. Requires the current password; the new
 * address is typed twice to avoid a lock-out typo. Applied immediately (no
 * confirmation email: the project has no custom SMTP for Supabase Auth). A
 * best-effort security notice goes to the owner's inbox, and the session is
 * ended so the admin signs in again with the new email.
 */
export async function changeEmail(input: z.input<typeof emailSchema>): Promise<ActionResult<{ email: string }>> {
  const user = await getAdminUser();
  if (!user) return unauthenticated();
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? validationMessage(parsed.error));
  const { newEmail, password } = parsed.data;
  const oldEmail = user.email ?? "";
  if (newEmail === oldEmail.toLowerCase()) return fail("That is already your sign-in email.");

  if (!(await hitRateLimit("email-change", user.id, 5, LOGIN_WINDOW_SECONDS))) {
    return fail("Too many attempts. Please wait 15 minutes and try again.");
  }
  if (!(await isCurrentPassword(oldEmail, password))) return fail("Current password is incorrect.");

  const { error } = await createAdminClient().auth.admin.updateUserById(user.id, { email: newEmail, email_confirm: true });
  if (error) {
    if (error.code === "email_exists" || /already/i.test(error.message)) return fail("That email is already used by another account.");
    console.error(`[auth] email change failed: ${error.message}`);
    return fail("Could not update the email. Please try again.");
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (to) {
    const when = new Date().toUTCString();
    const notice = await sendEmail({
      to,
      subject: "Your portfolio admin sign-in email was changed",
      text: `The admin sign-in email for your portfolio was changed from ${oldEmail} to ${newEmail} (${when}).\n\nNext step: update ADMIN_EMAIL in .env to the new address.\n\nIf this wasn't you: set ADMIN_EMAIL in .env to ${newEmail}, run \`npm run seed:admin -- --reset-password\` to take the account back with your .env password, then sign in and change the email back.`,
      html: `<p>The admin sign-in email for your portfolio was changed from <strong>${escapeHtml(oldEmail)}</strong> to <strong>${escapeHtml(newEmail)}</strong> (${escapeHtml(when)}).</p><p>Next step: update <code>ADMIN_EMAIL</code> in <code>.env</code> to the new address.</p><p>If this wasn't you: set <code>ADMIN_EMAIL</code> in <code>.env</code> to ${escapeHtml(newEmail)}, run <code>npm run seed:admin -- --reset-password</code> to take the account back with your <code>.env</code> password, then sign in and change the email back.</p>`,
    });
    if (!notice.ok) console.error("[auth] email-change notice could not be sent");
  }
  // End this session: Supabase leaves it in an inconsistent state after an
  // identity change, and signing in again confirms the new address works.
  await (await createSessionClient()).auth.signOut();
  (await cookies()).delete(SESSION_COOKIE);
  return ok({ email: newEmail });
}


