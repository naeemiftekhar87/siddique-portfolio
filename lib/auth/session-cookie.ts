import "server-only";
import { createHmac } from "node:crypto";
import { supabaseSecretKey } from "@/lib/db/env";
import { safeEqual } from "@/lib/security/hash";

/**
 * Absolute admin session lifetime. Supabase refresh tokens can live far
 * longer, so the sign-in time is kept in a signed, httpOnly cookie and the
 * session is treated as expired once it is older than this. The marker is
 * bound to the Supabase session ID so recovery cannot reuse a prior login.
 */
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const SESSION_COOKIE = "admin_session_started";

const sign = (payload: string) =>
  createHmac("sha256", supabaseSecretKey()).update(`admin-session:${payload}`).digest("base64url");

export function createSessionCookieValue(sessionId: string, now = Date.now()) {
  const issuedAt = String(now);
  const payload = `${sessionId}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

/** True when the cookie is present, correctly signed and not yet expired. */
export function isSessionCookieValid(value: string | undefined, sessionId: string | undefined, now = Date.now()) {
  if (!value || !sessionId) return false;
  const [boundSession, issuedAt, signature, extra] = value.split(".");
  if (extra || boundSession !== sessionId || !issuedAt || !signature || !safeEqual(signature, sign(`${boundSession}.${issuedAt}`))) return false;
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

/**
 * Options for the Supabase Auth cookies (sb-<ref>-auth-token). The app never
 * uses a browser Supabase client, so they are httpOnly: page scripts (and any
 * XSS) cannot read the session tokens.
 */
export const supabaseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * @supabase/ssr always writes a 400-day maxAge; cap it at the admin session
 * length. maxAge 0 (a deletion) is kept as is.
 */
export function capSupabaseCookie<T extends { maxAge?: number }>(options: T): T {
  return options.maxAge && options.maxAge > SESSION_MAX_AGE_SECONDS ? { ...options, maxAge: SESSION_MAX_AGE_SECONDS } : options;
}
