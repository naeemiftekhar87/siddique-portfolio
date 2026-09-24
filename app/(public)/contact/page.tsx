import type { Metadata } from "next";
import Contact from "@/components/portfolio/pages/Contact";
import { getSiteProfile } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Contact" };

export default async function Page() {
  const { email, location, linkedin, scholar, github } = await getSiteProfile();
  return <Contact profile={{ email, location, linkedin, scholar, github }} />;
}
