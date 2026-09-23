/**
 * Seeds the single admin user into Supabase Auth (idempotent).
 *
 *   npm run seed:admin                     # create the admin if missing
 *   npm run seed:admin -- --reset-password # also set the password from ADMIN_PASSWORD
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL, and
 * ADMIN_PASSWORD from .env. Never prints secrets. The user gets
 * app_metadata.role = "admin" (not user-editable), which the Phase 5 auth
 * guard can check.
 */
import { createClient, type User } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name} in .env`);
    process.exit(1);
  }
  return value;
}

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const secretKey = requireEnv("SUPABASE_SECRET_KEY");
const email = requireEnv("ADMIN_EMAIL").toLowerCase();
const password = requireEnv("ADMIN_PASSWORD");
const resetPassword = process.argv.includes("--reset-password");

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllUsers(): Promise<User[]> {
  const users: User[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

async function main() {
  const users = await listAllUsers();
  console.log(`Connected to Supabase Auth (${users.length} existing user(s)).`);

  const existing = users.find((u) => u.email?.toLowerCase() === email);
  const others = users.filter((u) => u !== existing);
  if (others.length > 0) {
    console.warn(
      `Warning: ${others.length} other auth user(s) exist; this is a single-owner app.`,
    );
  }

  if (!existing) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
    console.log(`Created admin ${data.user.email} (id ${data.user.id}).`);
    return;
  }

  const updates: Parameters<typeof supabase.auth.admin.updateUserById>[1] = {};
  if (existing.app_metadata?.role !== "admin") {
    updates.app_metadata = { ...existing.app_metadata, role: "admin" };
  }
  if (resetPassword) updates.password = password;

  if (Object.keys(updates).length === 0) {
    console.log(`Admin ${existing.email} already exists (id ${existing.id}); nothing to change.`);
    return;
  }

  const { error } = await supabase.auth.admin.updateUserById(existing.id, updates);
  if (error) throw error;
  console.log(
    `Updated admin ${existing.email} (id ${existing.id}): ${Object.keys(updates).join(", ")}.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Admin seed failed: ${message}`);
  process.exit(1);
});
