"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSessionClient } from "@/lib/db/server";
import { fail, ok, unauthenticated, type ActionResult } from "@/lib/actions/result";
import { getAdminUser, isAdmin } from "./session";
import { PENDING_MFA_COOKIE, RECOVERY_COOKIE, hasFlowCookie } from "./flow-cookie";
import { codeSchema, verifiedTotp, verifyCode } from "./mfa";
import { SESSION_COOKIE, createSessionCookieValue, sessionCookieOptions } from "./session-cookie";
import { hitRateLimit } from "@/lib/security/rate-limit";

export async function verifyLoginCode(code: string): Promise<ActionResult> {
  if ((await cookies()).has(RECOVERY_COOKIE) || !(await hasFlowCookie(PENDING_MFA_COOKIE))) return unauthenticated();
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !isAdmin(data.user)) return unauthenticated();
  if (!(await verifyCode(data.user!, code))) return fail("Invalid or expired code, or too many attempts. Try a fresh code; after repeated attempts, wait 15 minutes.");
  const store = await cookies();
  store.delete(PENDING_MFA_COOKIE);
  const claims = await supabase.auth.getClaims();
  if (claims.error || !claims.data?.claims.session_id) return unauthenticated();
  store.set(SESSION_COOKIE, createSessionCookieValue(claims.data.claims.session_id), sessionCookieOptions);
  return ok(null);
}

export async function enrollAuthenticator(): Promise<ActionResult<{ id: string; qrCode: string; secret: string }>> {
  const user = await getAdminUser();
  if (!user) return unauthenticated();
  if (verifiedTotp(user).length) return fail("An authenticator is already enabled.");
  if (!(await hitRateLimit("mfa-enroll", user.id, 5, 15 * 60))) return fail("Too many setup attempts. Wait 15 minutes.");
  const supabase = await createSessionClient();
  // Clear abandoned, unverified enrollments only. Never remove a verified factor here.
  for (const factor of user.factors ?? []) {
    if (factor.factor_type === "totp" && factor.status === "unverified") {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
      if (error) return fail("Could not restart authenticator setup. Please try again.");
    }
  }
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Portfolio admin", issuer: "Portfolio Admin" });
  if (error) return fail("Could not start setup. Check that TOTP enrollment is enabled in Supabase Auth.");
  return ok({ id: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
}

export async function confirmAuthenticator(input: { id: string; code: string }): Promise<ActionResult> {
  const user = await getAdminUser();
  if (!user) return unauthenticated();
  const parsed = z.object({ id: z.uuid(), code: codeSchema }).safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const factor = user.factors?.find((f) => f.id === parsed.data.id && f.factor_type === "totp" && f.status === "unverified");
  if (!factor || verifiedTotp(user).length) return fail("Restart authenticator setup.");
  if (!(await verifyCode(user, parsed.data.code, factor.id))) return fail("Invalid or expired code, or too many attempts. Use a fresh code or wait 15 minutes.");
  return ok(null);
}

export async function disableAuthenticator(input: { code: string; confirm: boolean }): Promise<ActionResult> {
  const user = await getAdminUser();
  if (!user) return unauthenticated();
  const parsed = z.object({ code: codeSchema, confirm: z.literal(true) }).safeParse(input);
  if (!parsed.success) return fail("Confirm removal and enter the 6-digit authenticator code.");
  if (!(await verifyCode(user, parsed.data.code))) return fail("Invalid or expired code, or too many attempts. Use a fresh code or wait 15 minutes.");
  const supabase = await createSessionClient();
  for (const factor of verifiedTotp(user)) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
    if (error) return fail("Could not remove the authenticator. Please try again.");
  }
  await supabase.auth.signOut();
  (await cookies()).delete(SESSION_COOKIE);
  return ok(null);
}
