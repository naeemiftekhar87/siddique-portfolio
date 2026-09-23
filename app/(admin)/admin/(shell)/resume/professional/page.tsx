import type { Metadata } from "next";
import AdminResumeEditor from "@/components/admin/pages/AdminResumeEditor";

export const metadata: Metadata = { title: "Professional Resume" };

export default function Page() {
  return <AdminResumeEditor />;
}
