import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SESSION_COOKIE, isSessionCookieValid } from "@/lib/auth/session-cookie";

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
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const signedIn =
    data?.claims?.app_metadata?.role === "admin" &&
    isSessionCookieValid(request.cookies.get(SESSION_COOKIE)?.value);

  // Only page navigations are redirected. Server Action POSTs pass through so
  // the action can answer "session expired" itself (a redirected POST would
  // come back as the login page's HTML and fail silently).
  const isNavigation = request.method === "GET" || request.method === "HEAD";
  const isLogin = request.nextUrl.pathname === "/admin/login";
  if (!isNavigation) return response;
  if (!signedIn && !isLogin) {
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
