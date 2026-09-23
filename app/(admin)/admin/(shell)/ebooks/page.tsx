import type { Metadata } from "next";
import AdminEBooks from "@/components/admin/pages/AdminEBooks";

export const metadata: Metadata = { title: "eBooks" };

export default function Page() {
  return <AdminEBooks />;
}
