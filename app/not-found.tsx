import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import SiteColorStyle from "@/components/portfolio/SiteColorStyle";
import NotFound from "@/components/portfolio/pages/NotFound";

// The source rendered its 404 inside the public layout (Navbar + Footer).
export default function NotFoundPage() {
  return (
    <>
      <SiteColorStyle />
      <Navbar />
      <NotFound />
      <Footer />
    </>
  );
}
