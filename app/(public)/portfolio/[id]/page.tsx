import type { Metadata } from "next";
import ProjectDetail from "@/components/portfolio/pages/ProjectDetail";

export const metadata: Metadata = { title: "Project" };

export default async function Page(props: PageProps<"/portfolio/[id]">) {
  const { id } = await props.params;
  return <ProjectDetail id={id} />;
}
