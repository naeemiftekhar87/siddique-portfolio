import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResearchDetail from "@/components/portfolio/pages/ResearchDetail";
import { getPaper, getPapers, getSiteProfile, parseId } from "@/lib/data/queries";

async function load(props: PageProps<"/research/[id]">) {
  const id = parseId((await props.params).id);
  return id ? getPaper(id) : null;
}

export async function generateMetadata(props: PageProps<"/research/[id]">): Promise<Metadata> {
  return { title: (await load(props))?.title ?? "Research Paper" };
}

export default async function Page(props: PageProps<"/research/[id]">) {
  const paper = await load(props);
  if (!paper) notFound();
  const [all, profile] = await Promise.all([getPapers(), getSiteProfile()]);
  const others = all.filter((p) => p.id !== paper.id).sort((a, b) => Number(b.area === paper.area) - Number(a.area === paper.area)).slice(0, 2);
  return <ResearchDetail paper={paper} others={others} profile={profile} />;
}
