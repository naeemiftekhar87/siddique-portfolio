import type { Metadata } from "next";
import AdminPortfolioGallery from "@/components/admin/pages/AdminPortfolioGallery";

export const metadata: Metadata = { title: "Portfolio Gallery" };

export default function Page() {
  return <AdminPortfolioGallery />;
}
