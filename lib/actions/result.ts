import type { z } from "zod";

/**
 * Uniform Server Action result: data on success, a readable message on
 * failure. `code: "unauthenticated"` tells the client the admin session has
 * expired (a redirect() thrown inside an action called from an event handler
 * would otherwise be lost).
 */
export type ActionResult<T = null> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: "unauthenticated" };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });
export const fail = (error: string): ActionResult<never> => ({ ok: false, error });
export const unauthenticated = (): ActionResult<never> => ({
  ok: false,
  error: "Your session has expired. Please sign in again.",
  code: "unauthenticated",
});

/** First validation message, prefixed with the field name for context. */
export function validationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Invalid input.";
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}
