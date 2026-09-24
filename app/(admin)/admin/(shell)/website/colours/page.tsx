import type { Metadata } from "next";
import AdminWebsiteColors from "@/components/admin/pages/AdminWebsiteColors";

export const metadata: Metadata = { title: "Colours Editor" };

export default function Page() {
  return <AdminWebsiteColors />;
}
