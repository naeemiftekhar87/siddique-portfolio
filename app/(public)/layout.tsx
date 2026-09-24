import PublicShell from "@/components/portfolio/PublicShell";

// Public pages are re-rendered right after every admin change (revalidatePath);
// the hourly revalidation is a safety net that also refreshes download counts
// and the footer's copyright year.
export const revalidate = 3600;

// Public site shell, ported from the source PublicLayout.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
