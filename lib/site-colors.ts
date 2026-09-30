// Site-wide public colours, edited at /admin/website/colours and saved in
// site_settings ("colors"). defaultSiteColors are the glossy dark theme's
// colours, used until the owner saves a change.

export type SiteColors = {
  /** Fixed top navigation bar (white text on top). */
  navbar: string;
  /** Header banner at the top of every inner page. */
  pageTop: string;
  /** Dark background behind all page content. */
  pageBackground: string;
  /** Page footer. */
  footer: string;
  /** Labels, links, icons and highlights on the dark pages. */
  accent: string;
  /** Soft ambient light behind the glass panels. */
  glow: string;
};

export const defaultSiteColors: SiteColors = {
  navbar: "#040d1f",
  pageTop: "#040d1f",
  pageBackground: "#040d1f",
  footer: "#0a1628",
  accent: "#93c5fd",
  glow: "#2563eb",
};

/** Normalise "#abc", "abc", "#AABBCC" or "aabbcc" to "#aabbcc"; null if invalid. */
export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(raw)) return `#${raw.split("").map((c) => c + c).join("")}`;
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw}`;
  return null;
}

function relativeLuminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colours (1–21). */
export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Saved colours with invalid values replaced by the defaults. */
export function resolveSiteColors(colors: SiteColors): SiteColors {
  const pick = (key: keyof SiteColors) => normalizeHex(colors[key] ?? "") ?? defaultSiteColors[key];
  return {
    navbar: pick("navbar"),
    pageTop: pick("pageTop"),
    pageBackground: pick("pageBackground"),
    footer: pick("footer"),
    accent: pick("accent"),
    glow: pick("glow"),
  };
}

/**
 * CSS custom properties consumed by the Navbar, Footer, page headers, the
 * body background and the accent/glow utilities (see app/globals.css).
 */
export function siteColorVars(colors: SiteColors): Record<string, string> {
  const c = resolveSiteColors(colors);
  return {
    "--site-navbar": c.navbar,
    "--site-footer": c.footer,
    "--site-top": c.pageTop,
    // Middle and end stops of the header gradients, derived from the header colour.
    "--site-top-mid": `color-mix(in oklab, ${c.pageTop}, white 4%)`,
    "--site-top-end": `color-mix(in oklab, ${c.pageTop}, white 12%)`,
    "--site-bg": c.pageBackground,
    "--site-accent": c.accent,
    "--site-glow": c.glow,
  };
}

export function siteColorCss(colors: SiteColors) {
  const body = Object.entries(siteColorVars(colors))
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  return `:root{${body}}`;
}
