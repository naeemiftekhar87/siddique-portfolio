import type { Metadata } from "next";
import EBooks from "@/components/portfolio/pages/EBooks";
import { getEbooks } from "@/lib/data/queries";

export const metadata: Metadata = { title: "eBooks" };

export default async function Page() {
  return <EBooks ebooks={await getEbooks()} />;
}
