import type { Metadata } from "next";
import Contact from "@/components/portfolio/pages/Contact";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return <Contact />;
}
