import type { Metadata } from "next";
import Research from "@/components/portfolio/pages/Research";

export const metadata: Metadata = { title: "Research" };

export default function Page() {
  return <Research />;
}
