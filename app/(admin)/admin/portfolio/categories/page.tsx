import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = { title: "Portfolio Categories" };

export default function AdminPortfolioCategoriesPage() {
  return <AdminPlaceholder title="Portfolio Categories" phase={6} />;
}
