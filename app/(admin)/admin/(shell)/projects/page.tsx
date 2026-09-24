import type { Metadata } from "next";
import AdminProjects from "@/components/admin/pages/AdminProjects";
import { getPortfolioCategories, getProjects } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Projects" };

export default async function Page() {
  const [projects, categories] = await Promise.all([getProjects(), getPortfolioCategories()]);
  return <AdminProjects initial={projects} categories={categories} />;
}
