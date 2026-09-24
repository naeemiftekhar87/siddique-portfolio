import type { Metadata } from "next";
import Portfolio from "@/components/portfolio/pages/Portfolio";
import { getGalleryItems, getPortfolioCategories, getProjects } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Portfolio" };

export default async function Page() {
  const [projects, categories, gallery] = await Promise.all([getProjects(), getPortfolioCategories(), getGalleryItems()]);
  return <Portfolio projects={projects} categories={categories} gallery={gallery} />;
}
