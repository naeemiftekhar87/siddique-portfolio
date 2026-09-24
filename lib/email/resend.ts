import "server-only";

/**
 * Minimal Resend adapter (REST API over fetch; no SDK dependency).
 * RESEND_API_KEY is server-only. Until the owner's domain is verified in
 * Resend, CONTACT_FROM_EMAIL can be left unset: Resend's test sender then
 * delivers only to the Resend account's own address.
 */
type EmailMessage = {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

export async function sendEmail(message: EmailMessage): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: "Email is not configured (RESEND_API_KEY missing)." };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
        to: [message.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`[email] Resend ${response.status}: ${body.slice(0, 300)}`);
      return { ok: false, error: `Resend returned ${response.status}.` };
    }
    return { ok: true };
  } catch (error) {
    console.error(`[email] Resend request failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, error: "Could not reach the email service." };
  }
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
