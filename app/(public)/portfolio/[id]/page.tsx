import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectPage(props: PageProps<"/portfolio/[id]">) {
  const { id } = await props.params;
  return <PagePlaceholder title="Project" phase={2} detail={`ID: ${id}`} />;
}
