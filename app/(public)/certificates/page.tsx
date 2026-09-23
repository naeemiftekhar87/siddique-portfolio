import type { Metadata } from "next";
import Certificates from "@/components/portfolio/pages/Certificates";

export const metadata: Metadata = { title: "Certificates" };

export default function Page() {
  return <Certificates />;
}
