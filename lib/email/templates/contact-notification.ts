import "server-only";
import { escapeHtml } from "@/lib/email/resend";

export type ContactNotification = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Owner's name from Profile, shown as the site name; may be empty. */
  siteName: string;
  receivedAt: Date;
};

// Brand colours from docs/design.md (email clients need literal values).
const NAVY = "#040d1f";
const CYAN = "#22d3ee";
const BLUE = "#2563eb";
const TEXT = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const PAGE = "#f1f5f9";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** One line: newlines in header-like fields are collapsed. */
const oneLine = (v: string) => v.replace(/\s+/g, " ").trim();

function formatReceived(date: Date) {
  return `${date.toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC",
  })} UTC`;
}

/**
 * Email sent to the owner for each contact-form submission. Table layout and
 * inline styles for email clients; no external images or tracking. The
 * visitor's address is shown (as a mailto link) and used as Reply-To.
 */
export function contactNotificationEmail(input: ContactNotification) {
  const name = oneLine(input.name);
  const email = oneLine(input.email);
  const subject = oneLine(input.subject);
  const site = oneLine(input.siteName) || "your portfolio";
  const received = formatReceived(input.receivedAt);
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  const e = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    site: escapeHtml(site),
    received: escapeHtml(received),
    message: escapeHtml(input.message.trim()).replace(/\r?\n/g, "<br>"),
    replyHref: escapeHtml(replyHref),
  };

  const row = (label: string, value: string) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid ${BORDER};width:110px;vertical-align:top;font:600 12px ${FONT};color:${MUTED};text-transform:uppercase;letter-spacing:.06em;">${label}</td>
                <td style="padding:10px 0;border-bottom:1px solid ${BORDER};vertical-align:top;font:15px/1.5 ${FONT};color:${TEXT};">${value}</td>
              </tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>New message from ${e.name}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE};">
  <!-- Preview text shown in the inbox list -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${e.name} (${e.email}) wrote: ${e.subject}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BORDER};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <div style="font:600 12px ${FONT};color:${CYAN};text-transform:uppercase;letter-spacing:.12em;">New contact message</div>
              <div style="font:600 22px/1.3 Georgia, 'Times New Roman', serif;color:#ffffff;margin-top:8px;">${e.subject}</div>
              <div style="font:14px ${FONT};color:#cbd5e1;margin-top:6px;">From the contact form on ${e.site}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row("Name", e.name)}${row("Email", `<a href="mailto:${e.email}" style="color:${BLUE};text-decoration:none;">${e.email}</a>`)}${row("Subject", e.subject)}${row("Received", e.received)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;">
              <div style="font:600 12px ${FONT};color:${MUTED};text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Message</div>
              <div style="background:#f8fafc;border:1px solid ${BORDER};border-left:4px solid ${BLUE};border-radius:8px;padding:16px 18px;font:15px/1.6 ${FONT};color:${TEXT};word-break:break-word;">${e.message}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:${BLUE};">
                    <a href="${e.replyHref}" style="display:inline-block;padding:12px 22px;font:600 14px ${FONT};color:#ffffff;text-decoration:none;border-radius:8px;">Reply to ${e.name}</a>
                  </td>
                </tr>
              </table>
              <div style="font:13px/1.5 ${FONT};color:${MUTED};margin-top:12px;">You can also just press Reply: this email's Reply-To is ${e.email}.</div>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;border-top:1px solid ${BORDER};padding:16px 32px;font:12px/1.5 ${FONT};color:${MUTED};">
              Sent automatically by the contact form on ${e.site}. The message is not stored on the website; this email is the only copy.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New contact message — ${site}`,
    "",
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Subject:  ${subject}`,
    `Received: ${received}`,
    "",
    "Message:",
    input.message.trim(),
    "",
    `Reply to this email to answer ${name} directly (Reply-To: ${email}).`,
    "The message is not stored on the website; this email is the only copy.",
  ].join("\n");

  return {
    subject: `New message from ${name}: ${subject}`,
    html,
    text,
  };
}
