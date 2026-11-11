import "server-only";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { createSessionClient } from "@/lib/db/server";
import { clientAddress, hitRateLimit } from "@/lib/security/rate-limit";

export const codeSchema = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit authenticator code.");
export const verifiedTotp = (user: User) => user.factors?.filter((f) => f.factor_type === "totp" && f.status === "verified") ?? [];

export async function hasRequiredAssurance(user: User) {
  if (!verifiedTotp(user).length) return true;
  const { data, error } = await (await createSessionClient()).auth.getClaims();
  return !error && data?.claims.aal === "aal2";
}

/** Bound by both account and address; Supabase also enforces its own limits. */
export async function allowMfaAttempt(userId: string) {
  const limits = await Promise.all([
    hitRateLimit("mfa-user", userId, 10, 15 * 60),
    hitRateLimit("mfa-ip", await clientAddress(), 10, 15 * 60),
  ]);
  return limits.every(Boolean);
}

export async function verifyCode(user: User, code: string, factorId = verifiedTotp(user)[0]?.id) {
  if (!codeSchema.safeParse(code).success || !factorId || !(await allowMfaAttempt(user.id))) return false;
  const { error } = await (await createSessionClient()).auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
  return !error;
}
