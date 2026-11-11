"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/db/admin";
import { createSessionClient } from "@/lib/db/server";
import { sendEmail, escapeHtml } from "@/lib/email/resend";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { clientAddress, hitRateLimit } from "@/lib/security/rate-limit";
import { isAdmin } from "./session";
import { SESSION_COOKIE } from "./session-cookie";
import { PENDING_MFA_COOKIE, RECOVERY_COOKIE, setFlowCookie, hasFlowCookie } from "./flow-cookie";
import { verifiedTotp, verifyCode } from "./mfa";

const recoveryMessage = "If this address belongs to the admin account, a password reset link will be emailed. Check your inbox and spam folder.";

/** No account-existence or delivery details are returned to an anonymous caller. */
export async function requestPasswordReset(email: string): Promise<ActionResult<{ message: string }>> {
  const parsed = z.string().trim().toLowerCase().email("Enter a valid email address.").max(200).safeParse(email);
  if (!parsed.success) return fail("Enter a valid email address.");
  const limits = await Promise.all([
    hitRateLimit("recovery-ip", await clientAddress(), 5, 60 * 60),
    hitRateLimit("recovery-email", parsed.data, 3, 60 * 60),
  ]);
  if (!limits.every(Boolean)) return ok({ message: recoveryMessage });

  try {
    // A configured canonical URL prevents reset-link poisoning via Host headers.
    const origin = new URL(process.env.SITE_URL ?? "");
    if (origin.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && origin.hostname === "localhost" && origin.protocol === "http:")) throw new Error("SITE_URL must use HTTPS");
    const { data, error } = await createAdminClient().auth.admin.generateLink({ type: "recovery", email: parsed.data });
    if (!error && isAdmin(data.user) && data.properties?.hashed_token) {
      // Fragment stays out of HTTP logs/referrers. Opening the page doesn't consume the link.
      const link = new URL("/admin/reset-password", origin.origin);
      link.hash = new URLSearchParams({ token_hash: data.properties.hashed_token }).toString();
      const sent = await sendEmail({
        to: parsed.data,
        subject: "Reset your portfolio admin password",
        text: `Use this one-time link to reset your admin password:\n\n${link}\n\nIt expires according to the Supabase Auth email OTP expiry. If you use Google Authenticator, you will also need its code. If you didn't request this, ignore this email.`,
        html: `<p>A password reset was requested for your portfolio admin account.</p><p><a href="${escapeHtml(link.toString())}">Reset password</a></p><p>This link is single-use and expires according to your authentication settings. If enabled, your authenticator code is also required. If you didn't request this, ignore this email.</p>`,
      });
      if (!sent.ok) console.error("[auth] password recovery email could not be delivered");
    }
  } catch {
    console.error("[auth] password recovery unavailable; check SITE_URL, Supabase and Resend configuration");
  }
  return ok({ message: recoveryMessage });
}

export async function beginPasswordRecovery(tokenHash: string): Promise<ActionResult<{ requiresMfa: boolean }>> {
  if (!z.string().regex(/^[a-f0-9]{40,128}$/i).safeParse(tokenHash).success) return fail("Invalid reset link. Request a new one.");
  if (!(await hitRateLimit("recovery-verify-ip", await clientAddress(), 10, 15 * 60))) return fail("Too many attempts. Wait 15 minutes.");
  const supabase = await createSessionClient();
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(PENDING_MFA_COOKIE);
  store.delete(RECOVERY_COOKIE);
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
  if (error || !isAdmin(data.user)) {
    await supabase.auth.signOut({ scope: "local" });
    return fail("This reset link is invalid, expired or already used. Request a new one.");
  }
  await setFlowCookie(RECOVERY_COOKIE);
  return ok({ requiresMfa: verifiedTotp(data.user!).length > 0 });
}

export async function resetPassword(input: { next: string; confirm: string; code: string }): Promise<ActionResult> {
  const parsed = z.object({
    next: z.string().min(12, "Use at least 12 characters.").max(128),
    confirm: z.string(), code: z.string().max(20),
  }).refine((v) => v.next === v.confirm, { message: "Passwords do not match." }).safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  if (!(await hasFlowCookie(RECOVERY_COOKIE))) return fail("Your recovery session expired. Request a new reset link.");
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !isAdmin(data.user)) return fail("Your recovery session expired. Request a new reset link.");
  if (!(await hitRateLimit("recovery-update", data.user!.id, 10, 15 * 60))) return fail("Too many attempts. Wait 15 minutes and request a new link.");
  if (verifiedTotp(data.user!).length && !(await verifyCode(data.user!, parsed.data.code))) return fail("Invalid or expired authenticator code, or too many attempts. Use a fresh code or wait 15 minutes.");
  // Use the user's recovery session, preserving Supabase's assurance checks.
  const updated = await supabase.auth.updateUser({ password: parsed.data.next });
  if (updated.error) return fail("Could not reset the password. Choose a different password or request a new link.");
  const signedOut = await supabase.auth.signOut({ scope: "global" });
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(RECOVERY_COOKIE);
  store.delete(PENDING_MFA_COOKIE);
  if (signedOut.error) console.error("[auth] password reset succeeded but global sign-out failed");
  return ok(null);
}
