import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import SiteColorStyle from "@/components/portfolio/SiteColorStyle";
import { getSettings, getSiteProfile } from "@/lib/data/queries";

/** Public site chrome (colours, Navbar, Footer) driven by the admin's saved settings. */
export default async function PublicShell({ children }: { children: React.ReactNode }) {
  const [profile, navigation, footer, colors] = await Promise.all([
    getSiteProfile(),
    getSettings("navigation"),
    getSettings("footer"),
    getSettings("colors"),
  ]);
  return (
    <>
      <SiteColorStyle colors={colors} />
      <Navbar
        name={profile.name}
        navLinks={navigation.links.filter((l) => l.visible)}
        social={{ scholar: profile.scholar, linkedin: profile.linkedin, github: profile.github }}
      />
      {children}
      <Footer profile={profile} footer={footer} />
    </>
  );
}
