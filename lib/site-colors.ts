// Site-wide public colours, edited at /admin/website/colours.
// Until Phase 5 persists them (Supabase), the public site always renders
// defaultSiteColors, which are the ported design's exact colours.

export type SiteColors = {
  /** Fixed top navigation bar (white text on top). */
  navbar: string;
  /** Page footer. */
  footer: string;
  /** Dark header section at the top of every inner page. */
  pageTop: string;
  /** Light page area below the header. */
  pageBody: string;
};

export const defaultSiteColors: SiteColors = {
  navbar: "#040d1f",
  footer: "#0a1628",
  pageTop: "#040d1f",
  pageBody: "#eef4ff",
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

/**
 * CSS custom properties consumed by the Navbar, Footer, page headers and the
 * body background. Default colours keep the design's exact secondary stops;
 * custom colours derive them from the chosen colour.
 */
export function siteColorVars(colors: SiteColors): Record<string, string> {
  const pick = (key: keyof SiteColors) => normalizeHex(colors[key]) ?? defaultSiteColors[key];
  const pageTop = pick("pageTop");
  const pageBody = pick("pageBody");
  const topIsDefault = pageTop === defaultSiteColors.pageTop;

  const vars: Record<string, string> = {
    "--site-navbar": pick("navbar"),
    "--site-footer": pick("footer"),
    "--site-top": pageTop,
    // Middle stop of the header gradient (design: #071428).
    "--site-top-mid": topIsDefault ? "#071428" : `color-mix(in oklab, ${pageTop}, white 4%)`,
    // End stop of the eBook detail header (design: Tailwind blue-950).
    // Tailwind emits --color-blue-950 because other components use blue-950.
    "--site-top-end": topIsDefault ? "var(--color-blue-950)" : `color-mix(in oklab, ${pageTop}, white 12%)`,
  };
  // The default body keeps the design's soft gradient (--gradient-body in
  // globals.css); a custom body colour is applied as a solid background.
  if (pageBody !== defaultSiteColors.pageBody) vars["--site-body-bg"] = pageBody;
  return vars;
}

export function siteColorCss(colors: SiteColors) {
  const body = Object.entries(siteColorVars(colors))
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  return `:root{${body}}`;
}
