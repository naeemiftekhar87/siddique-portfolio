import "server-only";
import { NextResponse } from "next/server";

/**
 * True when a POST comes from a page on this site: its Origin header must
 * match the host it was sent to. Browsers always send Origin on fetch/form
 * POSTs, so this blocks cross-site requests (CSRF, spam relayed through
 * visitors' browsers); requests without Origin (scripts) are refused too.
 */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const crossOriginResponse = () =>
  NextResponse.json({ ok: false, error: "Cross-site requests are not allowed." }, { status: 403 });
