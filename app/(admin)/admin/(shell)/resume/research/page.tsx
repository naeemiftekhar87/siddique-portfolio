import type { Metadata } from "next";
import AdminResumeEditor from "@/components/admin/pages/AdminResumeEditor";

export const metadata: Metadata = { title: "Research CV" };

export default function Page() {
  return <AdminResumeEditor />;
}
