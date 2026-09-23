import type { Metadata } from "next";
import AdminPublications from "@/components/admin/pages/AdminPublications";

export const metadata: Metadata = { title: "Publications" };

export default function Page() {
  return <AdminPublications />;
}
