import type { Metadata } from "next";
import InfographicResume from "@/components/portfolio/pages/InfographicResume";

export const metadata: Metadata = { title: "Infographic Resume" };

export default function Page() {
  return <InfographicResume />;
}
