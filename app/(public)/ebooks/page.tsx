import type { Metadata } from "next";
import EBooks from "@/components/portfolio/pages/EBooks";

export const metadata: Metadata = { title: "eBooks" };

export default function Page() {
  return <EBooks />;
}
