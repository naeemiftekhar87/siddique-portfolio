import type { Metadata } from "next";
import Experience from "@/components/portfolio/pages/Experience";

export const metadata: Metadata = { title: "Experience" };

export default function Page() {
  return <Experience />;
}
