import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/db/admin";
import { clientAddress, hitRateLimit } from "@/lib/security/rate-limit";

const bodySchema = z.object({ variant: z.enum(["professional", "infographic"]) });

// Counts one resume "Download PDF" (browser Save as PDF) in the anonymous
// daily download counter shown on the admin dashboard. No IP, cookie or
// visitor id is stored; the rate limit (keyed by a salted hash) only stops a
// single client from inflating the chart.
const LIMIT = 20;
const WINDOW_SECONDS = 60 * 60;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  if (!(await hitRateLimit("resume-download", await clientAddress(), LIMIT, WINDOW_SECONDS))) {
    return new NextResponse(null, { status: 204 }); // silently not counted
  }
  const { error } = await createAdminClient().rpc("increment_download", {
    p_kind: `resume-${parsed.data.variant}`,
    p_target_id: "",
  });
  if (error) console.error(`[downloads] resume ${parsed.data.variant}: ${error.message}`);
  return new NextResponse(null, { status: 204 });
}
