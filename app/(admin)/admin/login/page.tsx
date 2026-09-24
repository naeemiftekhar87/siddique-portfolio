import type { Metadata } from "next";
import AdminLogin from "@/components/admin/pages/AdminLogin";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Admin Login" };

export default async function Page() {
  const profile = await getSettings("profile");
  return <AdminLogin name={profile.name} />;
}
