import type { Metadata } from "next";
import AdminResumeEditor from "@/components/admin/pages/AdminResumeEditor";

export const metadata: Metadata = { title: "Academic CV" };

export default function Page() {
  return <AdminResumeEditor />;
}
