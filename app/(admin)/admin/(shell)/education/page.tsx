import type { Metadata } from "next";
import AdminEducation from "@/components/admin/pages/AdminEducation";
import { getEducation } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Education" };

export default async function Page() {
  return <AdminEducation initial={await getEducation()} />;
}
