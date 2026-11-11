import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SESSION_COOKIE, capSupabaseCookie, isSessionCookieValid, supabaseCookieOptions } from "@/lib/auth/session-cookie";
import { RECOVERY_COOKIE } from "@/lib/auth/flow-cookie";

/**
 * Admin routes: refreshes the Supabase session cookies and makes an
 * optimistic redirect to /admin/login when there is no valid session. The
 * authoritative check is requireAdmin() in the admin layout and in every
 * Server Action.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: supabaseCookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, capSupabaseCookie(options)));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  // getUser fetches current factor enrollment; an old aal1 JWT may predate setup.
  const user = data?.claims ? (await supabase.auth.getUser()).data.user : null;
  const needsMfa = user?.factors?.some((f) => f.factor_type === "totp" && f.status === "verified");
  const signedIn =
    user?.app_metadata?.role === "admin" &&
    data?.claims?.app_metadata?.role === "admin" &&
    !request.cookies.has(RECOVERY_COOKIE) &&
    (!needsMfa || data.claims.aal === "aal2") &&
    isSessionCookieValid(request.cookies.get(SESSION_COOKIE)?.value, data.claims.session_id);

  // Only page navigations are redirected. Server Action POSTs pass through so
  // the action can answer "session expired" itself (a redirected POST would
  // come back as the login page's HTML and fail silently).
  const isNavigation = request.method === "GET" || request.method === "HEAD";
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const isRecovery = ["/admin/forgot-password", "/admin/reset-password"].includes(request.nextUrl.pathname);
  if (!isNavigation) return response;
  if (!signedIn && !isLogin && !isRecovery) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (signedIn && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
