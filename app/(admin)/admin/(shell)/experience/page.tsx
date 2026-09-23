import type { Metadata } from "next";
import AdminExperience from "@/components/admin/pages/AdminExperience";

export const metadata: Metadata = { title: "Experience" };

export default function Page() {
  return <AdminExperience />;
}
