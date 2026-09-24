import { defaultSiteColors, siteColorCss, type SiteColors } from "@/lib/site-colors";

// Emits the admin-editable public colours as CSS variables. Phase 5 passes the
// colours saved at /admin/website/colours; until then the defaults are used.
export default function SiteColorStyle({ colors = defaultSiteColors }: { colors?: SiteColors }) {
  return <style>{siteColorCss(colors)}</style>;
}
