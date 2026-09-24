import "server-only";
import { createHmac } from "node:crypto";
import { supabaseSecretKey } from "@/lib/db/env";
import { safeEqual } from "@/lib/security/hash";

/**
 * Absolute admin session lifetime. Supabase refresh tokens can live far
 * longer, so the sign-in time is kept in a signed, httpOnly cookie and the
 * session is treated as expired once it is older than this.
 */
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const SESSION_COOKIE = "admin_session_started";

const sign = (issuedAt: string) =>
  createHmac("sha256", supabaseSecretKey()).update(`admin-session:${issuedAt}`).digest("base64url");

export function createSessionCookieValue(now = Date.now()) {
  const issuedAt = String(now);
  return `${issuedAt}.${sign(issuedAt)}`;
}

/** True when the cookie is present, correctly signed and not yet expired. */
export function isSessionCookieValid(value: string | undefined, now = Date.now()) {
  if (!value) return false;
  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature || !safeEqual(signature, sign(issuedAt))) return false;
  const age = now - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age < SESSION_MAX_AGE_SECONDS * 1000;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
