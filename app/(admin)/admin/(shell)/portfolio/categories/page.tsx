import type { Metadata } from "next";
import AdminPortfolioCategories from "@/components/admin/pages/AdminPortfolioCategories";
import { getPortfolioCategories } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Portfolio Categories" };

export default async function Page() {
  return <AdminPortfolioCategories initial={await getPortfolioCategories()} />;
}
