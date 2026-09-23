import type { Metadata } from "next";
import Education from "@/components/portfolio/pages/Education";

export const metadata: Metadata = { title: "Education" };

export default function Page() {
  return <Education />;
}
