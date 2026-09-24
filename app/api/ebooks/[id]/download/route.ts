import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/db/admin";
import { getEbook, parseId } from "@/lib/data/queries";

// "Download" link for an eBook: counts one anonymous download for today
// (no IP, cookie or visitor id; see download_stats) and redirects to the PDF.
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/ebooks/[id]/download">) {
  const id = parseId((await ctx.params).id);
  const book = id ? await getEbook(id) : null;
  if (!book?.fileUrl) return NextResponse.json({ ok: false, error: "eBook not found." }, { status: 404 });

  const { error } = await createAdminClient().rpc("increment_download", { p_kind: "ebook", p_target_id: String(book.id) });
  if (error) console.error(`[downloads] ebook ${book.id}: ${error.message}`);
  // Refresh the public download totals on the next visit.
  else revalidatePath("/ebooks");

  return NextResponse.redirect(book.fileUrl, 302);
}
