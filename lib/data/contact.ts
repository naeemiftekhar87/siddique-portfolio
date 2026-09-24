import { z } from "zod";

/** Contact form payload, validated in the browser and again on the server. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  subject: z.string().trim().min(3, "Please enter a subject.").max(200, "Subject is too long."),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000, "Message is too long (5,000 characters max)."),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(200).optional(),
});
