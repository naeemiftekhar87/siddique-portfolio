import PublicShell from "@/components/portfolio/PublicShell";

// Public pages are static and re-rendered right after every admin change
// (revalidatePath in lib/actions/helpers.ts). Do not add a segment-level
// `revalidate` here: it would make every Supabase fetch a Data Cache entry
// that survives rebuilds/deploys and can serve stale content.

// Public site shell, ported from the source PublicLayout.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
