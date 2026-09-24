import PublicShell from "@/components/portfolio/PublicShell";
import NotFound from "@/components/portfolio/pages/NotFound";

// The source rendered its 404 inside the public layout (Navbar + Footer).
export default function NotFoundPage() {
  return (
    <PublicShell>
      <NotFound />
    </PublicShell>
  );
}
