import type { Metadata } from "next";
import AdminPortfolioGallery from "@/components/admin/pages/AdminPortfolioGallery";
import { getGalleryItems } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Portfolio Gallery" };

export default async function Page() {
  return <AdminPortfolioGallery initial={await getGalleryItems()} />;
}
