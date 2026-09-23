import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Portfolio Gallery" };

export default function AdminPortfolioGalleryPage() {
  return <AdminPlaceholder title="Portfolio Gallery" phase={6} />;
}
