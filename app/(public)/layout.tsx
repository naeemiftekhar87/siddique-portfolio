import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";

// Public site shell, ported from the source PublicLayout.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
