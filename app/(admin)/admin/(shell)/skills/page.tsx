import type { Metadata } from "next";
import AdminSkills from "@/components/admin/pages/AdminSkills";

export const metadata: Metadata = { title: "Skills" };

export default function Page() {
  return <AdminSkills />;
}
