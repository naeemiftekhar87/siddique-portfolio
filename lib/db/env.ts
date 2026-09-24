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
