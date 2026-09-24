import type { Metadata } from "next";
import AdminEBooks from "@/components/admin/pages/AdminEBooks";
import { getEbooks } from "@/lib/data/queries";

export const metadata: Metadata = { title: "eBooks" };

export default async function Page() {
  return <AdminEBooks initial={await getEbooks()} />;
}
