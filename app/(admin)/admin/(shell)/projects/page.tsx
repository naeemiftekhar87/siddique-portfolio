import type { Metadata } from "next";
import AdminProjects from "@/components/admin/pages/AdminProjects";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return <AdminProjects />;
}
