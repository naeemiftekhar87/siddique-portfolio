# design.md — Design System (shadcn/ui + Tailwind CSS v4)

Single source of truth for typography, colour, glassmorphism, and the admin theme.
**Target file:** `src/index.css` (the CSS file referenced in `components.json → tailwind.css`).

> **Next.js adaptation (this repo):** this guide was written for Vite. Read `src/index.css` as `app/globals.css`, `index.html` font `<link>`s as `next/font/google` in `app/layout.tsx`, `src/components/ui/` as `components/ui/`, and the React Router `AdminLayout` (§4) as an `app/(admin)/admin/layout.tsx` with a small client component that toggles the `admin-theme dark` classes. The token values, component variants, and theme rules apply unchanged. The owner confirmed these fonts replace Geist (2026-09-23); load them with `next/font/google` instead of the §1.1 `<link>` tags. Design.md colours are also authoritative over any other hex values in the PRD or phases.
>
> **Installed shadcn (2026-09-23):** shadcn 4.x with the **Radix** base and **Nova** preset (Lucide icons). Differences from this guide: the `form` component no longer exists (use `field` with react-hook-form + zod); `sonner.tsx` takes an explicit `theme` prop instead of `next-themes`; the radius scale is Nova's (`rounded-sm` … `rounded-4xl`); the admin theme selector is `.admin-theme` so the admin wrapper is dark on the server render. Headings inside shadcn components use `font-heading`, which maps to the display font.

---

## 0. Instructions for the AI (read first)

1. This project uses **shadcn/ui** on **Tailwind CSS v4**. Do not create a `tailwind.config.js`. All tokens live in the CSS file.
2. Run `npx shadcn@latest init` first (base colour **Slate**, CSS variables **enabled**). Then **replace** the generated theme block in the CSS file with **Section 2** of this document. If the init command generates different variable names than the ones used here, keep shadcn's names and only swap in the values from this file.
3. **Never rename shadcn's semantic variables** (`--background`, `--foreground`, `--primary`, `--card`, `--border`, `--input`, `--ring`, `--sidebar-*`, `--chart-*`, and so on). shadcn components depend on them.
4. **Brand tokens** (`navy`, `electric`, `cyan`, `teal`, `surface`, and so on) are defined in `@theme` so Tailwind generates utilities such as `bg-navy`, `text-electric`, `border-brand-border`. Use those instead of hard-coded hex values.
5. Use **shadcn components** (Button, Card, Badge, Tabs, Accordion, Dialog, and so on) and style them through variants and the tokens below. Do not build custom buttons, inputs, or badges from scratch.
6. Headings (`h1`–`h3`, `CardTitle`, `DialogTitle`, hero headlines) use the **display font**. Everything else uses the **sans font**. Dates, credential IDs, DOIs, stat numbers, and filter tabs use the **mono font** (`font-mono` or `.font-data`).
7. The **public site** is the light theme with dark navy heroes. The **admin panel** is a separate dark theme, activated by adding `admin-theme dark` classes to `<html>` (see Section 4). This matters because shadcn portals (Dialog, Select, Popover, Sonner) render outside the layout wrapper.

---

## 1. Setup

### 1.1 Fonts — add to `index.html` `<head>`

Use `<link>` tags rather than a CSS `@import`. This avoids `@import` ordering problems with Tailwind and loads faster.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### 1.2 shadcn components to install

```bash
npx shadcn@latest add button card badge input textarea label select checkbox switch slider \
  tabs accordion dialog alert-dialog sheet dropdown-menu popover tooltip separator \
  table progress skeleton scroll-area alert toggle-group form sonner sidebar chart \
  breadcrumb pagination
```

---

## 2. `src/index.css` (copy-paste ready)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* ==========================================================================
   1. BRAND TOKENS  (generate Tailwind utilities AND are available as CSS vars)
   ========================================================================== */
@theme {
  /* Typography */
  --font-sans:
    "Plus Jakarta Sans", "Inter", system-ui, -apple-system, "Segoe UI",
    sans-serif;
  --font-display: "DM Serif Display", Georgia, "Times New Roman", serif;
  --font-mono:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Core colours */
  --color-navy: #040d1f;
  --color-navy-mid: #071428;
  --color-navy-light: #0a1e3d;

  --color-electric: #2563eb;
  --color-electric-bright: #3b82f6;

  --color-cyan: #06b6d4;
  --color-cyan-light: #22d3ee;

  --color-teal: #0d9488;
  --color-teal-light: #14b8a6;

  --color-surface: #eef4ff;
  --color-surface-2: #e4edff;
  --color-brand-border: #c7d9ff; /* named "brand-border" to avoid clashing with shadcn's --color-border */
  --color-brand-muted: #64748b; /* named "brand-muted" to avoid clashing with shadcn's --color-muted */

  --color-tag-bg: #eff6ff;
  --color-tag-text: #1d4ed8;
}

/* ==========================================================================
   2. SHADCN SEMANTIC VARIABLES — PUBLIC (LIGHT) THEME
   ========================================================================== */
:root {
  --radius: 0.75rem;

  --background: #eef4ff; /* surface */
  --foreground: #040d1f; /* navy */

  --card: #ffffff;
  --card-foreground: #040d1f;
  --popover: #ffffff;
  --popover-foreground: #040d1f;

  --primary: #2563eb; /* electric */
  --primary-foreground: #ffffff;

  --secondary: #eff6ff; /* tag-bg */
  --secondary-foreground: #1d4ed8; /* tag-text */

  --muted: #e4edff; /* surface-2 */
  --muted-foreground: #64748b;

  --accent: #e4edff;
  --accent-foreground: #040d1f;

  --destructive: #dc2626;

  --border: #c7d9ff;
  --input: #c7d9ff;
  --ring: #3b82f6;

  /* Chart palette (Recharts via shadcn <ChartContainer>) */
  --chart-1: #2563eb;
  --chart-2: #06b6d4;
  --chart-3: #0d9488;
  --chart-4: #f59e0b;
  --chart-5: #e11d48;

  /* Sidebar (shadcn Sidebar — mainly used by the admin theme) */
  --sidebar: #ffffff;
  --sidebar-foreground: #040d1f;
  --sidebar-primary: #2563eb;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #e4edff;
  --sidebar-accent-foreground: #040d1f;
  --sidebar-border: #c7d9ff;
  --sidebar-ring: #3b82f6;

  /* ---- Non-utility design tokens ---- */
  --gradient-body: linear-gradient(
    160deg,
    #eef4ff 0%,
    #f0f7ff 40%,
    #e8f3ff 70%,
    #eef4ff 100%
  );
  --gradient-hero: linear-gradient(to bottom right, #040d1f, #071428, #040d1f);
  --gradient-resume-header: linear-gradient(135deg, #040d1f, #071428);

  --hero-text-soft: #cbd5e1; /* slate-300 */
  --hero-text-muted: #94a3b8; /* slate-400 */
  --hero-accent: #22d3ee; /* cyan-400: accent labels */
  --hero-italic: #67e8f9; /* cyan-300: italic headline spans */

  --glass-card-bg: rgba(255, 255, 255, 0.75);
  --glass-card-bg-hover: rgba(255, 255, 255, 0.88);
  --glass-card-blur: 16px;
  --glass-card-border: 1px solid rgba(255, 255, 255, 0.6);
  --glass-card-shadow: 0 4px 24px rgba(37, 99, 235, 0.06);
  --glass-card-shadow-hover: 0 8px 40px rgba(37, 99, 235, 0.12);

  --glass-dark-bg: rgba(255, 255, 255, 0.07);
  --glass-dark-blur: 12px;
  --glass-dark-border: 1px solid rgba(255, 255, 255, 0.15);

  --nav-bg: rgba(4, 13, 31, 0.8);
  --nav-bg-scrolled: rgba(4, 13, 31, 0.95);
  --nav-blur: 12px;
  --nav-blur-scrolled: 24px;
  --nav-border-scrolled: rgba(255, 255, 255, 0.1);
  --nav-active-bg: rgba(255, 255, 255, 0.15);
  --nav-active-border: rgba(255, 255, 255, 0.2);

  --scrollbar-thumb: #93c5fd; /* blue-300 */
  --scrollbar-thumb-hover: #60a5fa; /* blue-400 */
  --selection-bg: #bfdbfe;
  --selection-text: #1e3a8a;

  --admin-input-bg: #ffffff; /* overridden in the admin theme */
}

/* ==========================================================================
   3. ADMIN (DARK) THEME
   Activated by adding "admin-theme dark" to <html> (see Section 4 of this doc).
   Must stay AFTER :root so it wins on equal specificity.
   ========================================================================== */
html.admin-theme {
  color-scheme: dark;

  --background: #020617; /* slate-950 */
  --foreground: #ffffff;

  --card: #0f172a; /* slate-900 */
  --card-foreground: #ffffff;
  --popover: #0f172a;
  --popover-foreground: #ffffff;

  --primary: #2563eb; /* blue-600 */
  --primary-foreground: #ffffff;

  --secondary: #1e293b; /* slate-800 */
  --secondary-foreground: #ffffff;

  --muted: #1e293b;
  --muted-foreground: #94a3b8; /* slate-400 (text secondary) */

  --accent: #1e293b;
  --accent-foreground: #ffffff;

  --destructive: #ef4444;

  --border: #1e293b; /* slate-800 */
  --input: #334155; /* slate-700 (input border) */
  --ring: #3b82f6;

  --chart-1: #3b82f6;
  --chart-2: #22d3ee;
  --chart-3: #14b8a6;
  --chart-4: #fbbf24;
  --chart-5: #fb7185;

  --sidebar: #020617;
  --sidebar-foreground: #94a3b8;
  --sidebar-primary: #2563eb;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #1e293b;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: #1e293b;
  --sidebar-ring: #3b82f6;

  --admin-input-bg: #1e293b; /* slate-800 */

  --scrollbar-thumb: #334155;
  --scrollbar-thumb-hover: #475569;
  --selection-bg: #1d4ed8;
  --selection-text: #ffffff;
}

/* ==========================================================================
   4. MAP SHADCN VARIABLES INTO TAILWIND UTILITIES
   ========================================================================== */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* ==========================================================================
   5. BASE LAYER  (typography, body, scrollbar, selection)
   ========================================================================== */
@layer base {
  * {
    @apply border-border outline-ring/50;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent; /* Firefox */
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    line-height: 1.6;
    min-height: 100vh;
    background-image: var(--gradient-body);
    background-attachment: fixed; /* gradient does not scroll */
    text-rendering: optimizeLegibility;
  }
  html.admin-theme body {
    background-image: none;
  }

  h1,
  h2,
  h3 {
    font-family: var(--font-display);
    font-weight: 400; /* DM Serif Display ships Regular + Italic only */
    line-height: 1.2;
  }
  h4,
  h5,
  h6 {
    font-family: var(--font-sans);
    font-weight: 600;
    line-height: 1.2;
  }

  a {
    color: var(--color-electric);
    text-decoration: none;
  }
  a:hover {
    color: var(--color-electric-bright);
  }
  html.admin-theme a {
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background: var(--selection-bg);
    color: var(--selection-text);
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

/* ==========================================================================
   6. CUSTOM CLASSES  (intentionally UNLAYERED)
   Unlayered CSS beats Tailwind utilities, so <Card className="glass-card">
   keeps its glass look even though Card applies bg-card / shadow-sm / border.
   ========================================================================== */

/* ---- Typography helpers ---- */
.font-data {
  font-family: var(--font-mono);
  font-weight: 400;
} /* dates, IDs, DOIs, stat numbers, filter tabs */
.font-data-md {
  font-family: var(--font-mono);
  font-weight: 500;
}
.hero-italic {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--hero-italic);
}
.hero-label {
  color: var(--hero-accent);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ---- Hero / dark sections ---- */
.hero-bg {
  background: var(--gradient-hero);
  color: #ffffff;
}
.hero-bg .text-soft {
  color: var(--hero-text-soft);
}
.hero-bg .text-muted {
  color: var(--hero-text-muted);
}

.resume-header {
  background: var(--gradient-resume-header);
  color: #ffffff;
}

/* ---- Glassmorphism ---- */
.glass-card {
  background: var(--glass-card-bg);
  -webkit-backdrop-filter: blur(var(--glass-card-blur));
  backdrop-filter: blur(var(--glass-card-blur));
  border: var(--glass-card-border);
  box-shadow: var(--glass-card-shadow);
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
}
.glass-card:hover {
  background: var(--glass-card-bg-hover);
  box-shadow: var(--glass-card-shadow-hover);
}

.glass-dark {
  background: var(--glass-dark-bg);
  -webkit-backdrop-filter: blur(var(--glass-dark-blur));
  backdrop-filter: blur(var(--glass-dark-blur));
  border: var(--glass-dark-border);
}

/* ---- Public navbar (toggle .is-scrolled from a scroll listener) ---- */
.navbar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  background: var(--nav-bg);
  -webkit-backdrop-filter: blur(var(--nav-blur));
  backdrop-filter: blur(var(--nav-blur));
  border-bottom: 1px solid transparent;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.navbar.is-scrolled {
  background: var(--nav-bg-scrolled);
  -webkit-backdrop-filter: blur(var(--nav-blur-scrolled));
  backdrop-filter: blur(var(--nav-blur-scrolled));
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.25),
    0 4px 6px -4px rgba(0, 0, 0, 0.25);
  border-bottom-color: var(--nav-border-scrolled);
}
.nav-link {
  color: var(--hero-text-soft);
  border: 1px solid transparent;
  border-radius: 9999px;
  padding: 0.375rem 0.875rem;
  font-weight: 500;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}
.nav-link:hover {
  color: #ffffff;
}
.nav-link.is-active {
  color: #ffffff;
  background: var(--nav-active-bg);
  border-color: var(--nav-active-border);
}
.nav-social:hover {
  color: var(--color-cyan-light);
}

/* ---- Admin: inputs use slate-800 background (shadcn defaults to a translucent one) ---- */
html.admin-theme [data-slot="input"],
html.admin-theme [data-slot="textarea"],
html.admin-theme [data-slot="select-trigger"] {
  background-color: var(--admin-input-bg);
  border-color: var(--input);
}

/* ---- Admin: success state (use on an <Alert> or a div) ---- */
.admin-success {
  background: rgba(5, 46, 22, 0.4); /* green-950/40 */
  border: 1px solid rgba(22, 101, 52, 0.5); /* green-800/50 */
  color: #4ade80; /* green-400 */
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
}
```

---

## 3. shadcn component customisation

After running `shadcn add`, make these small edits in `src/components/ui/`.

### 3.1 `button.tsx` — hover colour and a glass variant for dark heroes

```tsx
variant: {
  // change hover from "hover:bg-primary/90" to the brighter electric blue
  default: "bg-primary text-primary-foreground shadow-xs hover:bg-electric-bright",

  // ...keep the other shadcn variants (destructive, outline, secondary, ghost, link)...

  // NEW: secondary button on dark hero sections
  glass:
    "border border-white/15 bg-white/[0.07] text-white backdrop-blur-md hover:bg-white/15",
},
```

### 3.2 `badge.tsx` — tag, category, and status variants

```tsx
variant: {
  // ...keep shadcn's default / secondary / destructive / outline...

  tag:         "rounded-full border-brand-border bg-tag-bg text-tag-text",   // skill chips, keyword tags

  // Categories
  academic:     "border-blue-100 bg-blue-50 text-blue-700",
  research:     "border-cyan-100 bg-cyan-50 text-cyan-700",
  professional: "border-teal-100 bg-teal-50 text-teal-700",
  competition:  "border-amber-100 bg-amber-50 text-amber-700",
  community:    "border-rose-100 bg-rose-50 text-rose-700",

  // Research status
  published:    "border-green-100 bg-green-50 text-green-700",
  review:       "border-yellow-100 bg-yellow-50 text-yellow-700",   // Under Review
  working:      "border-blue-100 bg-blue-50 text-blue-700",         // Working Paper
},
```

Usage: `<Badge variant="published">Published</Badge>`, `<Badge variant="tag">Machine Learning</Badge>`.

### 3.3 Headings inside shadcn components use the display font

Add `font-display font-normal` to these title components (they render as `div`/`h2`, not `h1`–`h3`, so the base rule may not reach them):
`CardTitle`, `DialogTitle`, `AlertDialogTitle`, `SheetTitle`.

### 3.4 Tabs (filter tabs use mono)

Add `font-mono` to the `TabsTrigger` classes for filter tabs (All / Professional / Academic, category tabs, and so on).

### 3.5 Progress bars (skills, languages)

```tsx
<Progress
  value={level}
  className="h-2 bg-surface-2 *:data-[slot=progress-indicator]:bg-cyan"
/>
```

---

## 4. Admin theme wiring

The admin panel must switch the whole document, not just a wrapper `div`. shadcn's Dialog, Select, Popover, DropdownMenu, and Sonner render in portals attached to `<body>`, so a wrapper class would leave them light-themed.

```tsx
// src/pages/admin/AdminLayout.tsx
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("admin-theme", "dark");
    return () => root.classList.remove("admin-theme", "dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <SidebarProvider> + <AppSidebar /> + <Outlet /> */}
      <Outlet />
    </div>
  );
}
```

Admin component mapping: `Card` (slate-900 with slate-800 border), `Input` (slate-800 with slate-700 border), `Button` default (blue-600), `Sidebar` (slate-950 with slate-800 border). These come from the variables automatically, with no extra classes.

---

## 5. Quick reference

### Typography

| Role               | Family            | Weights            | Usage                                                  | How to use                     |
| ------------------ | ----------------- | ------------------ | ------------------------------------------------------ | ------------------------------ |
| Display / Headings | DM Serif Display  | Regular, Italic    | h1–h3, section titles, hero headlines, card headings   | `font-display` (auto on h1–h3) |
| UI / Body          | Plus Jakarta Sans | 400, 500, 600, 700 | Navigation, body, labels, buttons, prose               | `font-sans` (default)          |
| Fallback body      | Inter             | 300–700            | Fallback after Plus Jakarta Sans                       | in the `--font-sans` stack     |
| Mono / Data        | JetBrains Mono    | 400, 500           | Credential IDs, dates, stat numbers, DOIs, filter tabs | `font-mono` or `.font-data`    |

Heading line-height **1.2** · Body line-height **1.6** · Font smoothing **antialiased**

### Brand colour tokens (Tailwind utilities)

| Token                 | Hex                   | Utility examples              | Usage                                              |
| --------------------- | --------------------- | ----------------------------- | -------------------------------------------------- |
| `navy`                | `#040d1f`             | `bg-navy` `text-navy`         | Hero backgrounds, body text, darkest surfaces      |
| `navy-mid`            | `#071428`             | `bg-navy-mid`                 | Hero gradient midpoint, resume header gradient end |
| `navy-light`          | `#0a1e3d`             | `bg-navy-light`               | Lighter dark surfaces                              |
| `electric`            | `#2563eb`             | `bg-electric` `text-electric` | Primary buttons, primary links                     |
| `electric-bright`     | `#3b82f6`             | `hover:bg-electric-bright`    | Hover states, secondary highlights                 |
| `cyan`                | `#06b6d4`             | `bg-cyan` `text-cyan`         | Hero icon glow, language bar fills                 |
| `cyan-light`          | `#22d3ee`             | `text-cyan-light`             | Hero accent labels                                 |
| `teal`                | `#0d9488`             | `bg-teal`                     | Education accents, secondary category highlights   |
| `teal-light`          | `#14b8a6`             | `hover:bg-teal-light`         | Teal hover states                                  |
| `surface`             | `#eef4ff`             | `bg-surface`                  | Body background start/end                          |
| `surface-2`           | `#e4edff`             | `bg-surface-2`                | Deeper surface tint                                |
| `brand-border`        | `#c7d9ff`             | `border-brand-border`         | Card borders, dividers                             |
| `brand-muted`         | `#64748b`             | `text-brand-muted`            | Captions, metadata                                 |
| `tag-bg` / `tag-text` | `#eff6ff` / `#1d4ed8` | `bg-tag-bg text-tag-text`     | Skill chips, keyword tags                          |

### How your tokens map to shadcn variables

| shadcn variable      | Public (light)        | Admin (dark)          |
| -------------------- | --------------------- | --------------------- |
| `--background`       | `#eef4ff` (surface)   | `#020617` (slate-950) |
| `--foreground`       | `#040d1f` (navy)      | `#ffffff`             |
| `--card`             | `#ffffff`             | `#0f172a` (slate-900) |
| `--primary`          | `#2563eb` (electric)  | `#2563eb` (blue-600)  |
| `--secondary`        | `#eff6ff` (tag-bg)    | `#1e293b` (slate-800) |
| `--muted`            | `#e4edff` (surface-2) | `#1e293b`             |
| `--muted-foreground` | `#64748b`             | `#94a3b8` (slate-400) |
| `--border`           | `#c7d9ff`             | `#1e293b` (slate-800) |
| `--input`            | `#c7d9ff`             | `#334155` (slate-700) |
| `--ring`             | `#3b82f6`             | `#3b82f6`             |
| `--destructive`      | `#dc2626`             | `#ef4444`             |

### Category and status badge variants

| Variant                   | Background | Text       | Border     |
| ------------------------- | ---------- | ---------- | ---------- |
| `academic`                | blue-50    | blue-700   | blue-100   |
| `research`                | cyan-50    | cyan-700   | cyan-100   |
| `professional`            | teal-50    | teal-700   | teal-100   |
| `competition`             | amber-50   | amber-700  | amber-100  |
| `community`               | rose-50    | rose-700   | rose-100   |
| `published`               | green-50   | green-700  | green-100  |
| `review` (Under Review)   | yellow-50  | yellow-700 | yellow-100 |
| `working` (Working Paper) | blue-50    | blue-700   | blue-100   |

### Custom class cheat-sheet

| Class                          | Use for                                              |
| ------------------------------ | ---------------------------------------------------- |
| `.hero-bg`                     | Dark gradient hero sections                          |
| `.hero-italic` / `.hero-label` | Italic cyan headline spans / uppercase accent labels |
| `.glass-card`                  | Light-theme cards (combine with shadcn `Card`)       |
| `.glass-dark`                  | Stat tiles and cards inside hero sections            |
| `.navbar` + `.is-scrolled`     | Fixed public navbar                                  |
| `.nav-link` + `.is-active`     | Nav links with glass-pill active state               |
| `.font-data`                   | Mono styling for dates, IDs, DOIs, stat numbers      |
| `.resume-header`               | Navy gradient header of the resume document          |
| `.admin-success`               | Success message in the admin panel                   |

### Navbar glass (reference)

- Unscrolled: `rgba(4,13,31,0.8)` with `blur(12px)`
- Scrolled: `rgba(4,13,31,0.95)` with `blur(24px)`, shadow, `border-bottom: rgba(255,255,255,0.1)`
- Active link: `rgba(255,255,255,0.15)` background, `rgba(255,255,255,0.2)` border

---

## 6. Feature → shadcn component map

| Feature                                                                           | shadcn component(s)                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Buttons, CTAs, Download PDF                                                       | `Button` (`default`, `outline`, `glass`)                     |
| Skill/keyword chips, status and category labels                                   | `Badge` (`tag`, `academic`, `published`, and so on)          |
| All content cards                                                                 | `Card` + `.glass-card`                                       |
| Skills category tabs, Certificates filter, Research 3-section toggle, resume tabs | `Tabs` (or `ToggleGroup` for pill toggles)                   |
| Experience accordion, Upcoming Research cards                                     | `Accordion`                                                  |
| Mobile navbar menu                                                                | `Sheet`                                                      |
| Search bars, contact form fields                                                  | `Input`, `Textarea`, `Label`, `Field` (react-hook-form + zod) |
| Filters (status, area)                                                            | `Select`                                                     |
| Proficiency and language bars                                                     | `Progress`                                                   |
| Proficiency slider (admin), resume count sliders                                  | `Slider`                                                     |
| Section visibility toggles, notification toggles                                  | `Switch`                                                     |
| Admin delete confirmation (two-step)                                              | `AlertDialog`                                                |
| Add/edit forms in admin                                                           | `Dialog` or `Sheet` + `Form`                                 |
| Success/error messages                                                            | `Sonner` (toast)                                             |
| Admin sidebar layout                                                              | `Sidebar`                                                    |
| Admin data lists (messages, media list view)                                      | `Table`, `DropdownMenu`, `Pagination`                        |
| Dashboard charts (content-per-section bar, downloads area)                        | `Chart` (Recharts) using `--chart-1`…`--chart-5`            |
| DOI copy hint, icon buttons                                                       | `Tooltip`                                                    |
| Loading states                                                                    | `Skeleton`                                                   |
| Detail page back navigation                                                       | `Breadcrumb`                                                 |

---

## 7. Implementation checklist

- [ ] Run `npx shadcn@latest init` (Slate, CSS variables on)
- [ ] Add the font `<link>` tags to `index.html`
- [ ] Replace the generated theme in `src/index.css` with Section 2
- [ ] Install the shadcn components listed in Section 1.2
- [ ] Apply the edits in Section 3 (`button.tsx`, `badge.tsx`, titles, tabs)
- [ ] Add the `AdminLayout` class toggle from Section 4
- [ ] Confirm headings render in DM Serif Display and body text in Plus Jakarta Sans
- [ ] Confirm the body gradient stays fixed while scrolling on public pages and is absent in admin
- [ ] Open a Dialog, Select, and toast inside admin and confirm they are dark
- [ ] Toggle `.is-scrolled` on the navbar via a scroll listener
- [ ] Search the codebase for hard-coded hex values and replace them with tokens or utilities
