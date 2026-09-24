import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/data/contact";
import { escapeHtml, sendEmail } from "@/lib/email/resend";
import { clientAddress, hitRateLimit } from "@/lib/security/rate-limit";

// Contact form → owner's inbox via Resend. Nothing is stored (docs/memory.md
// decision 18). Limits: 5 messages per hour per client address.
const LIMIT = 5;
const WINDOW_SECONDS = 60 * 60;

const json = (status: number, body: { ok: boolean; error?: string }) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return json(400, { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." });
  const { name, email, subject, message, website } = parsed.data;

  // Bots fill the hidden field; answer as if sent so they learn nothing.
  if (website) return json(200, { ok: true });

  if (!(await hitRateLimit("contact", await clientAddress(), LIMIT, WINDOW_SECONDS))) {
    return json(429, { ok: false, error: "Too many messages from your connection. Please try again later." });
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!to) {
    console.error("[contact] CONTACT_TO_EMAIL is not set");
    return json(500, { ok: false, error: "Messages cannot be delivered right now. Please try again later." });
  }

  const sent = await sendEmail({
    to,
    replyTo: email,
    subject: `Portfolio contact: ${subject.replace(/[\r\n]+/g, " ")}`,
    text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });
  if (!sent.ok) {
    return json(502, { ok: false, error: "Your message could not be sent. Please try again later." });
  }
  return json(200, { ok: true });
}
