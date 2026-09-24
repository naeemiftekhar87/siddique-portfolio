import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookDetail from "@/components/portfolio/pages/BookDetail";
import { getEbook, getEbooks, getSiteProfile, parseId } from "@/lib/data/queries";

async function load(props: PageProps<"/ebooks/[id]">) {
  const id = parseId((await props.params).id);
  return id ? getEbook(id) : null;
}

export async function generateMetadata(props: PageProps<"/ebooks/[id]">): Promise<Metadata> {
  return { title: (await load(props))?.title ?? "eBook" };
}

export default async function Page(props: PageProps<"/ebooks/[id]">) {
  const book = await load(props);
  if (!book) notFound();
  const [all, profile] = await Promise.all([getEbooks(), getSiteProfile()]);
  return <BookDetail book={book} others={all.filter((b) => b.id !== book.id).slice(0, 4)} profile={profile} />;
}
