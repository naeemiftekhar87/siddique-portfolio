import type { Metadata } from "next";
import AdminLogin from "@/components/admin/pages/AdminLogin";

export const metadata: Metadata = { title: "Admin Login" };

export default function Page() {
  return <AdminLogin />;
}
