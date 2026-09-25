import "server-only";

function requireEnv(name: string, value: string | undefined): string {
  if (!value?.trim()) throw new Error(`Missing environment variable ${name}`);
  return value.trim();
}

// NEXT_PUBLIC_* values must be referenced literally so Next can inline them.
export const supabaseUrl = () => requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabasePublishableKey = () =>
  requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
/** Secret (sb_secret_…) key: bypasses RLS. Server only, after the admin session is verified. */
export const supabaseSecretKey = () => requireEnv("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);

/**
 * Sent as a header on server-side Supabase requests. Next.js keeps fetch
 * responses made while prerendering static pages in its Data Cache, which
 * survives rebuilds (and is restored between Vercel deployments); request
 * headers are part of the cache key, so each deployment starts with fresh
 * data. Within a deployment, admin writes purge entries via revalidatePath.
 * Locally (no deployment id) clear `.next/cache` to force fresh data.
 */
export const dataCacheHeaders = {
  "x-deployment-id": process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
};
