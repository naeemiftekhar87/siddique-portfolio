import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Research Paper" };

export default async function ResearchPaperPage(props: PageProps<"/research/[id]">) {
  const { id } = await props.params;
  return <PagePlaceholder title="Research Paper" phase={3} detail={`ID: ${id}`} />;
}
