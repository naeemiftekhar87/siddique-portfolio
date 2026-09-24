import type { Metadata } from "next";
import AdminProfile from "@/components/admin/pages/AdminProfile";
import { getLanguages, getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Personal Information" };

export default async function Page() {
  const [profile, languages] = await Promise.all([getSettings("profile"), getLanguages()]);
  return <AdminProfile initial={profile} languages={languages} />;
}
