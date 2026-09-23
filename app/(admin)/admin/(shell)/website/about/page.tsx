import type { Metadata } from "next";
import AdminWebsiteAbout from "@/components/admin/pages/AdminWebsiteAbout";

export const metadata: Metadata = { title: "About Page Editor" };

export default function Page() {
  return <AdminWebsiteAbout />;
}
