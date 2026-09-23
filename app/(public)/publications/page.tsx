import type { Metadata } from "next";
import Publications from "@/components/portfolio/pages/Publications";

export const metadata: Metadata = { title: "Publications" };

export default function Page() {
  return <Publications />;
}
