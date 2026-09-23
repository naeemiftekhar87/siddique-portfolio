import type { Metadata } from "next";
import AdminProfile from "@/components/admin/pages/AdminProfile";

export const metadata: Metadata = { title: "Personal Information" };

export default function Page() {
  return <AdminProfile />;
}
