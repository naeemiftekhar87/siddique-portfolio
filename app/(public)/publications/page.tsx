import type { Metadata } from "next";
import Publications from "@/components/portfolio/pages/Publications";
import { getPapers, getSiteProfile } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Publications" };

export default async function Page() {
  const [publications, profile] = await Promise.all([getPapers(), getSiteProfile()]);
  return <Publications publications={publications} profile={profile} />;
}
