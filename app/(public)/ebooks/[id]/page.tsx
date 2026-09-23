import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/portfolio/page-placeholder";

export const metadata: Metadata = { title: "eBook" };

export default async function EbookPage(props: PageProps<"/ebooks/[id]">) {
  const { id } = await props.params;
  return <PagePlaceholder title="eBook" phase={3} detail={`ID: ${id}`} />;
}
