import type { Metadata } from "next";
import { PasswordRecovery } from "@/components/admin/password-recovery";

export const metadata: Metadata = { title: "Reset password" };

export default function Page() {
  return <PasswordRecovery reset />;
}
