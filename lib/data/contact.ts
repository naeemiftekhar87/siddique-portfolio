import { z } from "zod";

// This module also runs in the browser (contact form validation). There the
// site's CSP forbids eval, so skip zod's `new Function` probe, which strict
// CSPs report as a violation even though zod catches it.
if (typeof window !== "undefined") z.config({ jitless: true });

/** Contact form payload, validated in the browser and again on the server. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  subject: z.string().trim().min(3, "Please enter a subject.").max(200, "Subject is too long."),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000, "Message is too long (5,000 characters max)."),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(200).optional(),
});
