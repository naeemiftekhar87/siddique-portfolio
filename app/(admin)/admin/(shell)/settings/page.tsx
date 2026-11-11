import type { Metadata } from "next";
import AdminSettings from "@/components/admin/pages/AdminSettings";
import { requireAdmin } from "@/lib/auth/session";
import { getSettings } from "@/lib/data/queries";
import { verifiedTotp } from "@/lib/auth/mfa";

export const metadata: Metadata = { title: "Settings" };

export default async function Page() {
  const [links, user] = await Promise.all([getSettings("links"), requireAdmin()]);
  return <AdminSettings initial={links} email={user.email ?? ""} mfaEnabled={verifiedTotp(user).length > 0} />;
}
