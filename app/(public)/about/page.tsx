import type { Metadata } from "next";
import About from "@/components/portfolio/pages/About";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <About />;
}
