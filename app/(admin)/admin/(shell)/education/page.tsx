import type { Metadata } from "next";
import AdminEducation from "@/components/admin/pages/AdminEducation";

export const metadata: Metadata = { title: "Education" };

export default function Page() {
  return <AdminEducation />;
}
