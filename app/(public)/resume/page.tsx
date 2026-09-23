import type { Metadata } from "next";
import Resume from "@/components/portfolio/pages/Resume";

export const metadata: Metadata = { title: "Resume Center" };

export default function Page() {
  return <Resume />;
}
