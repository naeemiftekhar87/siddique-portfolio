import type { Metadata } from "next";
import AdminExperience from "@/components/admin/pages/AdminExperience";
import { getExperiences } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Experience" };

export default async function Page() {
  return <AdminExperience initial={await getExperiences()} />;
}
