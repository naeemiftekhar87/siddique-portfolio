import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth/session";
import { UploadError, createUploadTarget } from "@/lib/storage/media";

const bodySchema = z.object({ type: z.string().max(100), size: z.number().int().nonnegative() });

// Upload step 1 (admin only): validate the file's type and size and return a
// signed URL so the browser uploads directly to Supabase Storage.
export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ ok: false, error: "Your session has expired. Please sign in again." }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, data: await createUploadTarget(parsed.data) });
  } catch (error) {
    const message = error instanceof UploadError ? error.message : "Upload failed. Please try again.";
    return NextResponse.json({ ok: false, error: message }, { status: error instanceof UploadError ? 400 : 500 });
  }
}
