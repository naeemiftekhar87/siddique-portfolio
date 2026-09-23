import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/pages/AdminDashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <AdminDashboard />;
}
