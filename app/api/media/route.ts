import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth/session";
import { UploadError, finalizeUpload } from "@/lib/storage/media";
import { revalidateSite } from "@/lib/actions/helpers";

const bodySchema = z.object({
  bucket: z.enum(["images", "documents"]),
  path: z.string().max(100),
  name: z.string().max(300),
});

// Upload step 2 (admin only): verify the object the browser uploaded with the
// signed URL and record it in the media library.
export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ ok: false, error: "Your session has expired. Please sign in again." }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  try {
    const asset = await finalizeUpload(parsed.data);
    revalidateSite();
    return NextResponse.json({ ok: true, data: asset }, { status: 201 });
  } catch (error) {
    const message = error instanceof UploadError ? error.message : "Upload failed. Please try again.";
    return NextResponse.json({ ok: false, error: message }, { status: error instanceof UploadError ? 400 : 500 });
  }
}
