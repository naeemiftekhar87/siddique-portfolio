import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import NotFound from "@/components/portfolio/pages/NotFound";

// The source rendered its 404 inside the public layout (Navbar + Footer).
export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <NotFound />
      <Footer />
    </>
  );
}
