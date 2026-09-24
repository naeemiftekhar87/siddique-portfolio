import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/pages/AdminDashboard";
import { getDashboardData } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Page() {
  const { counts, activity, downloads } = await getDashboardData();
  return <AdminDashboard counts={counts} activity={activity} downloads={downloads} />;
}
