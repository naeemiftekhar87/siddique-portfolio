import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Supabase serves uploaded files (Storage) and receives browser uploads
// (signed upload URLs), so its origin is allowed for those directives only.
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";

// Content-Security-Policy without nonces (Next.js CSP guide, "Without Nonces"):
// a nonce-based policy would force every page to render dynamically, losing
// the static + on-demand revalidation the public site relies on. Scripts are
// limited to this origin (plus the inline bootstrap Next.js emits).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Owner-supplied images may be pasted URLs from any https host.
  "img-src 'self' blob: data: https:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseOrigin}`,
  // eBook "Read online" embeds the PDF from Supabase Storage.
  `object-src ${supabaseOrigin || "'none'"}`,
  `frame-src ${supabaseOrigin || "'none'"}`,
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Only on Vercel (HTTPS); a local `next start` is served over plain http.
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

// Baseline security headers for every response (phases.md 7.4). HSTS only
// matters over HTTPS (Vercel); browsers ignore it on plain http://localhost.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
