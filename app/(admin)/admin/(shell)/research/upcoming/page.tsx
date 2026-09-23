import type { Metadata } from "next";
import AdminResearchUpcoming from "@/components/admin/pages/AdminResearchUpcoming";

export const metadata: Metadata = { title: "Upcoming Research" };

export default function Page() {
  return <AdminResearchUpcoming />;
}
