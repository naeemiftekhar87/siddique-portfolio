// Public site shell (light theme). The Navbar and Footer are added in Phase 1.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="flex-1">
      {children}
    </main>
  );
}
