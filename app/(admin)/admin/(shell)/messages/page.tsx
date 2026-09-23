import type { Metadata } from "next";
import AdminMessages from "@/components/admin/pages/AdminMessages";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return <AdminMessages />;
}
