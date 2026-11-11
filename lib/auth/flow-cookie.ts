import "server-only";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { supabaseSecretKey } from "@/lib/db/env";
import { safeEqual } from "@/lib/security/hash";
import { sessionCookieOptions } from "./session-cookie";
import { createSessionClient } from "@/lib/db/server";

export const PENDING_MFA_COOKIE = "admin_pending_mfa";
export const RECOVERY_COOKIE = "admin_password_recovery";
const MAX_AGE = 15 * 60;

const signature = (name: string, payload: string) =>
  createHmac("sha256", supabaseSecretKey()).update(`${name}:${payload}`).digest("base64url");

/** Short-lived proof bound to the exact Supabase session, never just a user id. */
export async function setFlowCookie(name: string) {
  const { data, error } = await (await createSessionClient()).auth.getClaims();
  if (error || !data?.claims.session_id) throw new Error("Missing authenticated session");
  const payload = `${data.claims.session_id}.${Date.now()}`;
  (await cookies()).set(name, `${payload}.${signature(name, payload)}`, { ...sessionCookieOptions, maxAge: MAX_AGE });
}

export async function hasFlowCookie(name: string) {
  const value = (await cookies()).get(name)?.value;
  if (!value) return false;
  const [sessionId, issuedAt, signed, extra] = value.split(".");
  if (extra || !sessionId || !issuedAt || !signed || !safeEqual(signed, signature(name, `${sessionId}.${issuedAt}`))) return false;
  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age >= MAX_AGE * 1000) return false;
  const { data, error } = await (await createSessionClient()).auth.getClaims();
  return !error && data?.claims.session_id === sessionId;
}
