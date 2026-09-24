import type { Metadata } from "next";
import AdminMedia from "@/components/admin/pages/AdminMedia";
import { getMediaAssets } from "@/lib/storage/media";

export const metadata: Metadata = { title: "Media Library" };

export default async function Page() {
  return <AdminMedia initial={await getMediaAssets()} />;
}
