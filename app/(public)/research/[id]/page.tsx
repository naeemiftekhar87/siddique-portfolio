import type { Metadata } from "next";
import ResearchDetail from "@/components/portfolio/pages/ResearchDetail";

export const metadata: Metadata = { title: "Research Paper" };

export default async function Page(props: PageProps<"/research/[id]">) {
  const { id } = await props.params;
  return <ResearchDetail id={id} />;
}
