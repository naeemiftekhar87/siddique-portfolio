import { defaultSiteColors, siteColorCss, type SiteColors } from "@/lib/site-colors";

// Emits the colours saved at /admin/website/colours as CSS variables.
export default function SiteColorStyle({ colors = defaultSiteColors }: { colors?: SiteColors }) {
  return <style>{siteColorCss(colors)}</style>;
}
