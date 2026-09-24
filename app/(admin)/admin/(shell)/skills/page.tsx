import type { Metadata } from "next";
import AdminSkills from "@/components/admin/pages/AdminSkills";
import { getSkills } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Skills" };

export default async function Page() {
  return <AdminSkills initial={await getSkills()} />;
}
