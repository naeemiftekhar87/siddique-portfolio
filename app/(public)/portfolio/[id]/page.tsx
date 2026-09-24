import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/portfolio/pages/ProjectDetail";
import { getProject, getProjects, parseId } from "@/lib/data/queries";

async function load(props: PageProps<"/portfolio/[id]">) {
  const id = parseId((await props.params).id);
  return id ? getProject(id) : null;
}

export async function generateMetadata(props: PageProps<"/portfolio/[id]">): Promise<Metadata> {
  return { title: (await load(props))?.title ?? "Project" };
}

export default async function Page(props: PageProps<"/portfolio/[id]">) {
  const project = await load(props);
  if (!project) notFound();
  const others = (await getProjects()).filter((p) => p.id !== project.id).slice(0, 2);
  return <ProjectDetail project={project} others={others} />;
}
