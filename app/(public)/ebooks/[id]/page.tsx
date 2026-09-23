import type { Metadata } from "next";
import BookDetail from "@/components/portfolio/pages/BookDetail";

export const metadata: Metadata = { title: "eBook" };

export default async function Page(props: PageProps<"/ebooks/[id]">) {
  const { id } = await props.params;
  return <BookDetail id={id} />;
}
