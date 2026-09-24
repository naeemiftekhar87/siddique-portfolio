import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { getAdminUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/db/admin";
import { fail, ok, unauthenticated, validationMessage, type ActionResult } from "./result";

type AdminClient = ReturnType<typeof createAdminClient>;
type DbError = { message: string; code?: string };

/** An error whose message is safe to show to the admin. */
export class UserError extends Error {}

/** Throws on a Supabase error; maps known Postgres codes to readable messages. */
export function check<R extends { data: unknown; error: DbError | null }>(label: string, result: R): NonNullable<R["data"]> {
  if (result.error) {
    if (result.error.code === "23505") throw new UserError(`That ${label} already exists.`);
    if (result.error.code === "PGRST116") throw new UserError(`That ${label} no longer exists.`);
    console.error(`[admin] ${label}: ${result.error.message}`);
    throw new Error(result.error.message);
  }
  if (result.data === null || result.data === undefined) throw new UserError(`That ${label} no longer exists.`);
  return result.data as NonNullable<R["data"]>;
}

/** Re-renders every public page (and admin screens) after a content change. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/**
 * Standard admin mutation: verify the session, validate the input, run the
 * write with the privileged client, revalidate, and return a readable result.
 */
export async function mutate<S extends z.ZodType, R>(
  schema: S,
  input: unknown,
  run: (value: z.output<S>, db: AdminClient) => Promise<R>,
): Promise<ActionResult<R>> {
  if (!(await getAdminUser())) return unauthenticated();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(validationMessage(parsed.error));
  try {
    const data = await run(parsed.data, createAdminClient());
    revalidateSite();
    return ok(data);
  } catch (error) {
    if (error instanceof UserError) return fail(error.message);
    return fail("Something went wrong while saving. Please try again.");
  }
}
