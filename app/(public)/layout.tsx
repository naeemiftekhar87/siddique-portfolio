import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import SiteColorStyle from "@/components/portfolio/SiteColorStyle";

// Public site shell, ported from the source PublicLayout.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteColorStyle />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
