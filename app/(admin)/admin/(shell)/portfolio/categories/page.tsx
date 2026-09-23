import type { Metadata } from "next";
import AdminPortfolioCategories from "@/components/admin/pages/AdminPortfolioCategories";

export const metadata: Metadata = { title: "Portfolio Categories" };

export default function Page() {
  return <AdminPortfolioCategories />;
}
