# Project Memory

> **Read this first.** It is the canonical handoff file: it should give a new agent enough context to start work without re-reading the whole repo. Update it at the end of every work session (the "Session log" and any section whose facts changed).
>
> **Last updated:** 2026-09-25 (Phase 5/6 build)

---

## 1. What this project is

A personal **academic + professional portfolio** for a single owner (Siddique), with a built-in **single-owner admin CMS**. The owner enters data once in the admin, and it drives the public site, two resume variants (Professional and Infographic) with PDF export, and SEO metadata.

- **Public site:** 20 routes for recruiters, researchers, institutions, and readers.
- **Admin panel:** `/admin/*`, a login plus about 29 management screens: content CRUD, research, resume editors, portfolio, website editors, media, and settings.
- **Out of scope for v1:** multi-tenant use, eBook payments, a blog or newsletter, native apps, any automatic import or sync from LinkedIn/Scholar/ResearchGate/ORCID, analytics or visitor tracking, SEO tooling, and 2FA (removed from the PRD on 2026-09-23).

---

## 2. Tech stack and repo state

| Item         | Value                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Framework    | Next.js **16.3.5**, App Router, root-level `app/` (no `src/`)                                        |
| UI           | React 19.2.8, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/postcss`, tokens in `app/globals.css`)    |
| Fonts        | DM Serif Display, Plus Jakarta Sans, Inter, JetBrains Mono via `next/font/google` (`app/layout.tsx`) |
| Lint         | ESLint 9 + `eslint-config-next`                                                                      |
| Tests        | **None configured.** Do not claim tests pass.                                                        |
| Commands     | `npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`                                |
| Path alias   | `@/*` → repo root                                                                                    |
| Next.js docs | `node_modules/next/dist/docs/` (read before coding; v16 differs from older examples)                 |

**Current code (as of 2026-09-23, after porting the owner's design source):**

- **Design source:** the owner's Vite + React Router prototype at `/mnt/FR-project/Build Website from Shard File/` (Figma Make export; its data and spec described a _different person_, "Mohammad Iftekhar Ayub"). **Owner instruction: keep the design exactly as the source.** Do not restyle the ported components.
- **Ported UI:**
  - `components/portfolio/pages/*.tsx`: 19 public pages plus `NotFound`.
  - `components/portfolio/Navbar.tsx` and `Footer.tsx`.
  - `components/admin/pages/*.tsx`: 29 admin screens, with `AdminAnalytics` dropped.
  - Routing moved from React Router to `next/link`/`next/navigation`. Detail pages (`CertificateDetail`, `ProjectDetail`, `ResearchDetail`, `BookDetail`) are server components that take an `id` prop. Pages with hooks, handlers or Recharts are `"use client"`.
- **Routes:**
  - `app/(public)/layout.tsx` (Navbar + page + Footer) with thin `page.tsx` wrappers that export metadata. `app/not-found.tsx` renders Navbar + `NotFound` + Footer. `NotFound` reads the path via `useSyncExternalStore`, which fixes a hydration mismatch on the prerendered 404.
  - `app/(admin)/admin/layout.tsx` sets noindex metadata only.
  - `app/(admin)/admin/(shell)/layout.tsx` wraps every module in the ported `AdminLayout` (sidebar and top bar).
  - `/admin/login` sits outside the shell.
  - `(shell)/[...slug]` renders `AdminGeneric` for unknown admin paths, as in the source.
  - Added `/admin/certificates/training` and `/awards` (owner decision).
- **Data (historical, Phases 1–4):** `lib/data/index.ts` was **obviously fake placeholder data** with the source's exact shape and item counts ("Your Name", "Sample Company A", "Example Paper Title 1", "Sample Category A"–E, "Research Area A"–F, scholar metrics 0). Real values: LinkedIn, Scholar and ResearchGate URLs. `github` is `https://github.com/` until the owner provides theirs. All hard-coded prose about the source person (bios, employer, degrees, research topics, SEO entries, editor defaults, working papers, gallery, media names, eBook chapters) was replaced with placeholders. A final grep for his name, employers, institutions and fields is clean. Stock Unsplash images, including a stock portrait as the profile photo, are kept as design placeholders.
- **Scope edits vs. source:** the Analytics admin page, sidebar link, dashboard "Visitors" card and "View Analytics" quick action are removed (no-analytics decision); the quick action became "Edit Resume". Gallery/Categories sidebar links point to the PRD URLs `/admin/portfolio/...`. The admin avatar initial is "A".
- **`app/globals.css`:** brand and shadcn tokens from design.md, but the base layer and unlayered rules **mirror the source `index.css`** so the ported pages render identically:
  - No global link colour, no forced heading weight, `html`-level thin scrollbar at 6 px.
  - The unlayered `a, button { transition: all .2s }` rule, and the source's `.glass-card`/`.glass`.
  - `--font-serif` maps to DM Serif, and Tailwind's **default** radius scale is kept (Nova's overrides were removed).
  - shadcn's border/outline defaults are scoped to `[data-slot]`.
  - The design.md `.admin-theme` class remains in CSS but is **not applied**: the admin HTML-class toggle was removed because the ported admin uses its own slate classes.
- **Root layout:** design.md fonts via `next/font` (DM Serif Display, Plus Jakarta Sans, Inter, JetBrains Mono) and `TooltipProvider`. Body has no layout classes, matching the source.
- **shadcn:** installed (Radix base, Nova preset) in `components/ui/`, but **not used by the ported pages**. `sonner.tsx` has no `next-themes`; `hooks/use-mobile.ts` uses `useSyncExternalStore`.
- **Phase 5 backend (2026-09-25):** the site is fully database-driven; the placeholder data is gone. See §2a.
- **Other:** `scripts/seed-admin.mts` (`npm run seed:admin`, idempotent; `-- --reset-password` updates the password) created the single Supabase Auth admin (`app_metadata.role = "admin"`). **Open concern:** it was created as `admin@gmail.com`, which is probably not the owner's inbox. The owner was advised to set a real `ADMIN_EMAIL` and a longer password, delete that user in Supabase, and re-run the seed. `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `server-only` and the `supabase` CLI (dev) are installed.
- **Empty folders (`.gitkeep`):** `public/{images,documents,icons}/` only.
- **Checks (2026-09-23):**
  - `npx tsc --noEmit` is clean. `npm run lint` has 0 errors and 29 warnings, all `@next/next/no-img-element`, kept on purpose because switching to `next/image` changes layout. `npm run build` passes (51 pages).
  - Playwright screenshots of 26 routes compared at 1440 px and 360 px against the running source app: layouts match, with no horizontal overflow at 360 px and no console errors.
- `.env` (gitignored) holds all Phase 5 vars (see §7).
- `.kilo/` (untracked) holds Kilo Code agent state (see §6).

### 2a. Phase 5/6 implementation (2026-09-25)

- **Database** (`supabase/migrations/20260925000000_initial_schema.sql`, applied with `npm run db:push`, which builds the DB URL from `.env`; the direct host is IPv6):
  - Collections: `experiences`, `education`, `skills`, `achievements`, `certificates`, `portfolio_categories`, `projects` (`category_id` FK, `on delete set null`), `gallery_items`, `research_papers`, `upcoming_research`, `languages`, `ebooks`. Bigint identity ids, `updated_at` triggers.
  - `site_settings(key, value jsonb)` holds the singletons: `profile`, `links`, `research_profile`, `research_interests`, `home`, `about`, `navigation`, `footer`, `colors`, `resume_professional`, `resume_infographic`. Each is validated by zod (`lib/data/settings.ts`), with defaults in `lib/data/defaults.ts` until first save.
  - `media_assets`, `download_stats` (day, kind, target_id, count; function `increment_download`), `rate_limits` (salted-hash key; function `hit_rate_limit`).
  - RLS is on everywhere: public SELECT on content and settings; no policies on media/stats/rate limits; the functions are executable by `service_role` only.
  - Storage buckets: `images` (public, 5 MB, jpeg/png/webp/gif/avif) and `documents` (public, 50 MB, pdf).
- **Types:** `lib/db/database.types.ts` is **generated from the live schema** by `npm run db:types` (`scripts/gen-db-types.mts`, which uses the `postgres` dev dependency over the direct DB connection). The output has the same format as `supabase gen types`, with no Docker or `supabase login` needed. Re-run after every migration.
- **Clients** (`lib/db/`, all `server-only`): `public.ts` (publishable key, no session, for public reads), `server.ts` (cookie session via `@supabase/ssr`), `admin.ts` (secret key; only after `requireAdmin()` or for server-owned counters and limits).
- **Auth** (`lib/auth/`, `proxy.ts`):
  - Login, logout and password change are Server Actions.
  - `requireAdmin()` is called in the `(shell)` layout and in every mutation. It checks the Supabase user with `app_metadata.role === "admin"` plus a signed httpOnly `admin_session_started` cookie, giving an **8-hour absolute session**.
  - `proxy.ts` refreshes cookies on `/admin/*` and redirects early.
  - Login rate limit: 10 attempts per 15 minutes per client address and per email, stored in Supabase.
  - Password change needs the current password (checked with a throwaway client), at least 12 characters, and is rate-limited.
- **Data layer** (`lib/data/`):
  - `schemas.ts`: zod schemas and domain types, with camelCase names matching the ported UI.
  - `mappers.ts`: row ⇄ domain conversion.
  - `queries.ts`: `server-only` reads wrapped in React `cache()`. `getSiteProfile()` merges profile, links, research profile and interests into the shape the pages use.
  - `constants.ts` (pick-lists), `citation.ts` (APA/BibTeX), `research.ts` (`?tab=` ids, `paperLink`), `format.ts` (`dateRange`), `resume.ts` (resume data loader), `dashboard.ts`, `contact.ts`.
  - `index.ts` exports only client-safe types and constants.
- **Writes** (`lib/actions/`): `content.ts` (save/delete for every collection, plus category reorder), `settings.ts` (`saveSettings(key, value)`) and `media.ts` (`deleteMedia`, which refuses while content still references the file).
  - All of them go through `mutate()` in `helpers.ts`: `requireAdmin` → zod → write → `revalidatePath("/", "layout")`, with friendly errors (duplicate, missing, validation) and server-side logging.
- **Route Handlers:**
  - Uploads are two-step, so files never pass through the app server (Vercel caps function request bodies at ~4.5 MB; PDFs may be 50 MB). `POST /api/media/sign` is admin only: it validates the declared type and size and returns a one-time signed Storage URL. The browser then uploads directly (`components/admin/upload.ts`, using supabase-js `uploadToSignedUrl`). Finally `POST /api/media` (admin) re-checks the stored object's content type, size and magic bytes (read with a Range request), deletes anything that fails, and records it in `media_assets`. Bucket limits also apply at Storage.
  - `POST /api/contact`: zod, honeypot field `website`, 5 per hour per address, Resend REST via `lib/email/resend.ts`; no SDK and nothing stored.
  - `GET /api/ebooks/[id]/download`: counts the download, then redirects to the PDF.
- **Caching:** public pages are static (prerendered at build, so the build needs DB access) and re-rendered on demand by `revalidatePath` after every admin write, plus `revalidate = 3600` on the public layout as a safety net (download counts, copyright year). `/research` is dynamic because it reads `?tab=`. Admin pages are dynamic.
- **Admin UI:** every screen gets its data from its server `page.tsx` and saves through the actions.
  - Shared helpers: `components/admin/use-action.ts` (transition plus sonner toasts), `confirm-delete.tsx` (two-step delete) and `upload.ts`.
  - `image-source-field.tsx` now **uploads on pick** and returns the Storage URL; `pdf-upload-field.tsx` handles PDFs.
  - Also added: `languages-card.tsx` (Languages on the Profile screen) and `dashboard-charts.tsx`.
  - Error and loading boundaries live in the `(shell)` group.
- **Public UI:** page components take props from their server `page.tsx`, and empty values or sections are hidden.
  - `PublicShell` renders colours, the Navbar (visible nav links, social icons only when set) and the Footer (quick links, tagline, copyright).
  - Detail routes call `notFound()` on bad or missing ids.
  - Client helpers: `copy-button.tsx`, `share-button.tsx` and `print-button.tsx`.
  - `(public)/error.tsx` handles load failures.
- **Verification (2026-09-25):**
  - 3 Playwright e2e stages against `next start` on the live DB: 14 + 40 + 26 checks. All pass except one test-harness timing check (DOI copy), which was re-verified manually.
  - Coverage: auth, guard, logout, expiry, lockout; CRUD for every module; uploads and validation; public pages reflecting edits; `?tab=`; settings; resume toggles; media in-use guard; dashboard.
  - 360 px: no overflow on any public page or the checked admin pages (the media controls were fixed).
  - Print-to-PDF renders A4 correctly.
  - All test rows, files, settings and rate-limit rows were deleted afterwards. **The DB is empty again.**
  - tsc is clean, lint has 0 errors (the warnings are `no-img-element`, plus an untracked `.kilo/worktrees` copy), and the build passes (45 routes).

---

## 3. Documentation map

| File                             | Purpose                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AGENTS.md` (+ `CLAUDE.md` → it) | Canonical agent guide: conventions, folder layout, completion checklist.                                                 |
| `docs/memory.md`                 | **This file**, for current state, decisions, and the session log.                                                        |
| `docs/PRD.md`                    | Scope, P0/P1/P2 requirements (§5 public, §6 admin), entities (§7), NFRs, roadmap, sitemap (§14).                         |
| `docs/phases.md`                 | Ordered checkbox tracker for Phases 1–7 with a Definition of Done per phase.                                             |
| `docs/design.md`                 | Tokens, fonts, glassmorphism, shadcn variants, admin dark theme. Written for Vite, so adapt the paths (note at the top). |
| `docs/architecture.md`           | Layers, folder targets, flows (public/admin/contact/resume), security, caching, open decisions (§11).                    |
| `docs/rules.md`                  | The owner's rules for agents (see §11 below for the essentials).                                                         |

---

## 4. Product at a glance

**Public routes:** `/`, `/about`, `/experience`, `/education`, `/skills`, `/achievements`, `/certificates` (+`/[id]`), `/portfolio` (+`/[id]`), `/research` (tabs via `?tab=`), `/research/[id]`, `/research/upcoming`, `/publications`, `/ebooks` (+`/[id]`), `/resume`, `/resume/infographic`, `/contact`, 404.

**Admin routes:** `/admin/login`, `/admin` (dashboard), profile, experience, education, skills, achievements, certificates/{professional,academic}, projects, publications, research/{papers,profile,interests,upcoming,working}, ebooks, resume/{professional,academic,research,infographic}, portfolio/{gallery,categories}, website/{home,about,navigation,footer}, seo, media, settings.

**Entities (PRD §7):** Profile, Experience, Education, Skill, Achievement, Certificate, Project, ResearchPaper/Publication, UpcomingResearch, WorkingPaper, Language, eBook, Message, ResumeConfig, PortfolioCategory, NavItem/FooterConfig/PageConfig, MediaAsset, AdminUser, DownloadStat (anonymous daily download counts).

**Seed data target (Phase 1, `lib/data/index.ts`):** 1 profile, 6 experiences, 2 education, 38 skills, 15 certificates, 4 projects, 6 papers, 4 languages, 5 eBooks, 12 achievements. All entries are **clearly marked placeholders** because the owner enters real content through the admin (decision 8). Per `docs/rules.md` §19–20, never invent realistic-looking personal or research data (jobs, degrees, DOIs, citation counts, and so on).

**Owner's external profiles** (given by the owner on 2026-09-23; tracking/session query params stripped):

| Profile        | URL                                                          |
| -------------- | ------------------------------------------------------------ |
| LinkedIn       | https://www.linkedin.com/in/mdtarakesiddique                 |
| Google Scholar | https://scholar.google.com/citations?user=ohf_wZIAAAAJ&hl=en |
| ResearchGate   | https://www.researchgate.net/profile/Md-Siddique-50          |

These are link targets only: use them for social icons, the footer, and research-profile links, and as their initial values. **Never fetch or scrape them** (see decision 8). **GitHub: the owner will provide the URL** (pending), and the navbar keeps the PRD's Scholar / LinkedIn / GitHub icons. No ORCID URL has been given. The owner's display name must come from the owner, not be inferred from the URL slugs.

**Visual identity:** light public pages with dark navy (`#040d1f`) gradient heroes, cyan/electric-blue accents, amber highlights, glass cards, and a fixed glass navbar. The admin has a separate dark slate theme (`admin-theme dark` on `<html>` so shadcn portals are dark too). Fonts (decided): DM Serif Display (headings), Plus Jakarta Sans (body), and JetBrains Mono (data). **`docs/design.md` is authoritative for all colours and fonts.**

**Phases (from `docs/phases.md`):**

1. Foundation: tokens, shadcn, shared components, Navbar/Footer/404, types and seed data.
2. Core public pages (static data).
3. Research and eBooks.
4. Resume system and PDF.
5. Backend and admin core (Supabase, auth, CRUD, public site reads live data).
6. Advanced admin (research mgmt, contact-to-email pipeline, resume editors, website editors, media, settings).
7. Hardening and launch.

---

## 5. Key decisions (confirmed)

1. **Full-stack Next.js in one repo.** Route Handlers under `app/api/` and Server Actions; no Express, Vite, React Router, or separate API repo. Deploy on a Node server runtime, not static export.
2. **Supabase for data, media, and auth (Phase 5).** Postgres is the source of truth for entities, Storage holds media (only URLs and metadata go into Postgres), and Supabase Auth provides email/password login with cookie sessions. Server-only access sits behind `lib/db/` and `lib/storage/`, and the secret key (`sb_secret_…`) never reaches the client. Mixing in another persistence system needs a written decision record.
3. **No analytics module and no visitor tracking** (reconfirmed 2026-09-23). There is no `/admin/analytics`, `/api/analytics`, `lib/analytics/`, page views, time on site, or bounce rate. The dashboard has 8 stat cards (Experience, Degrees, Skills, Certificates, Projects, Research Papers, Publications, eBooks) plus two Recharts charts: **content items per section** (bar), which replaced "top pages", and **downloads over time** (area). Downloads come from the `DownloadStat` entity: anonymous daily counts per resume variant or eBook, with no IP, cookie, or visitor ID. A cookieless hosted analytics tool (Plausible, Umami, Vercel) is only a post-launch backlog idea and needs owner approval.
4. **No 2FA.** It was removed from PRD §6.1 and phases.md §7.4 by the owner (2026-09-23).
5. Single owner and admin, with no public accounts. Content is in English. Scholar metrics are entered manually in v1.
6. Route groups `(public)` and `(admin)` are organizational only, and URLs match PRD §14.
7. Phases 1–4 use typed temporary seed data in `lib/data/`, clearly marked as temporary and never presented as persistent.
8. **All content is entered manually by the owner through the admin dashboard** (decided 2026-09-23). There is no automatic fetching, scraping, API import, or sync from LinkedIn, Google Scholar, ResearchGate, ORCID, or any other source. That covers profile, experience, papers, and Scholar metrics (citations, h-index, i10-index). The seed data in `lib/data/index.ts` is therefore **clearly marked placeholder content** that exists only to build and test the UI. The only real values it may contain are the profile URLs above. Real content arrives once the Phase 5 admin CRUD exists (phases.md 7.5).
9. **The database starts empty** (revised 2026-09-23; this replaces the earlier "seed sample data" decision). Phase 5 seeds only the admin user. The admin panel and, once connected, the public site show only what the owner adds. `lib/data/index.ts` placeholders exist solely to build the public UI during Phases 1–4 and are never loaded into the database.
10. **Design follows `docs/design.md`** (decided 2026-09-23). Fonts are DM Serif Display, Plus Jakarta Sans (Inter fallback), and JetBrains Mono, loaded via `next/font/google` and replacing Geist. Colours come from design.md tokens; the footer uses the `navy` token (`#040d1f`), not the PRD's old `#0a1628`. The PRD and phases were updated to match.

11. **Data layer: plain Supabase client** (decided 2026-09-23; the Kilo Prisma + TanStack plan was rejected).
    - `@supabase/supabase-js` + `@supabase/ssr` in server-only `lib/db/` modules. There is a cookie-aware client for the admin session and a service-role client for writes, used only after the session is verified.
    - No Prisma, TanStack Query, or TanStack Form.
    - Schema is Supabase CLI SQL migrations (`supabase/migrations/`) with generated TypeScript types. RLS is on for every table: public content gets read-only policies; stats, rate limits, and config have none.
    - Public reads: Server Components → `lib/data/` selectors.
    - Admin CRUD: **Server Actions** (session check → zod → write → revalidate).
    - Route Handlers are used only for auth, contact, media upload, resume export, and the download counter.
    - Admin forms use shadcn `Form` (react-hook-form + zod). Charts use Recharts via shadcn `Chart`.
12. **Owner answers, 2026-09-23:**
    - **Branding:** no logo. The owner's name (from Profile) is the navbar/footer wordmark, in the display font.
    - **eBooks:** free with no payments, and the `price` field was removed. The owner uploads a PDF (Supabase Storage) and the detail page shows it in an in-site viewer (_Read online_) plus _Download_ (counted in `DownloadStat`). Android Chrome and some mobile browsers can't show PDFs inline, so a fallback opens the file instead. A viewer library such as pdf.js would need approval.
    - **Language:** English only.
    - **Resume PDF:** must match the site exactly. The server renders the same resume route in headless Chromium (A4 print CSS) at `app/api/resume/export`. Choose the package in Phase 4 with the hosting target (Playwright, or `puppeteer-core` + `@sparticuz/chromium` on serverless), with owner approval.
    - **Email:** Resend, behind a server-only `lib/email/` adapter using `RESEND_API_KEY`. Until a custom domain is verified, Resend can only send from its test sender to the account owner's own address, which is enough for owner notifications.
    - **Database:** the Supabase DB is **empty**. Migrations create the schema, no content is seeded (decision 9), and an **admin seed script** creates the single Supabase Auth user through the Admin API from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. It is idempotent and the credentials are never committed.
    - **Hosting: Vercel** (2026-09-23). Use the Node.js runtime for routes that use the service-role client, Resend, or Chromium. The resume PDF uses `puppeteer-core` + `@sparticuz/chromium` (needs approval in Phase 4; watch Vercel's function size and duration limits). Rate limits for login and contact must be stored in Supabase, not in memory. Env vars live in Vercel project settings.
    - **Domain:** a custom domain is registered at **Namecheap**, with **no mailbox**. It points to Vercel via DNS, and Resend sends from it after SPF/DKIM/DMARC records are added at Namecheap (no mailbox needed to send). Contact submissions go to the owner's personal address (see decision 18), with Reply-To set to the visitor.
    - **Env vars still to add** (to the gitignored `.env`): `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (Phase 6). `CONTACT_TO_EMAIL` was added 2026-09-24.
13. **Design source ported; design must stay identical** (2026-09-23). The owner's Vite prototype is the visual source of truth for all pages; where it differs from `docs/design.md` (hard-coded hex classes, `<img>` tags, admin styling), the **ported design wins**. Its person-specific content was replaced with obvious placeholders (owner's choice). Training/Awards certificate admin pages were kept (owner's choice).
14. **No SEO module** (2026-09-23, owner: "remove the SEO fully"). The `/admin/seo` page, route, and sidebar link, the `SEOEntry` entity, and all SEO scope (per-page meta/OG/canonical editing, sitemap.xml, robots.txt, JSON-LD, the Lighthouse SEO target, Search Console) are removed from the code, PRD, phases, architecture, and AGENTS.md. **Kept:** plain page `<title>`s (browser tabs) and `noindex` on `/admin`. `docs/rules.md` §18 (the owner's file) still asks for SEO-friendly pages; this was flagged to the owner rather than edited.
15. **Admin changes (2026-09-23):**
    - **Resume variants:** only **Professional** and **Infographic**. The Academic CV and Research CV were removed from the public `/resume` tabs, the Research & Publications block on those CVs, the admin editor tabs, the sidebar, the routes, and the PRD/phases.
    - **Settings:** only Social & Academic Links plus Change Password. Removed: Personal Information (it duplicated `/admin/profile`), Notification Preferences (contact emails are always sent), and Danger Zone.
    - **Admin starts empty:** every admin screen starts with no sample data. The dashboard shows 0 counts and "No activity yet"; list screens show "No … yet" empty states; form screens start blank from `emptyProfile` in `lib/data`, which keeps only the owner's real LinkedIn/Scholar/ResearchGate links. The public site still uses the placeholders until Phase 5.
16. **shadcn for all UI components, keeping the current look** (2026-09-24). Rolled out in two batches; **both are done** (admin on 2026-09-24, then the public site).
    - `components/ui/{button,input,textarea,native-select,label,card,table}.tsx` were extended with design variants. Each has the exact ported classes, no shadcn base, and a `data-design` attribute.
    - `unstyled` passes `className` raw, with no tailwind-merge step, because merging can drop classes such as `block` when `flex` is also present.
    - Button design variants: `admin-primary`, `admin-secondary`, `admin-outline`, `admin-icon-danger|edit|info|teal`, `admin-ghost`, `admin-ghost-danger`, `admin-danger-sm`. Field variants (Input/Textarea/NativeSelect): `admin-field`, `admin-field-dark`. Label: `admin-label`. Card: `admin-panel`.
    - Public-site variants (batch 2). Button: `site-primary`, `site-glass`, `site-outline`, also used as `<Button asChild>` around button-styled `Link`/`<a>` CTAs. Field: `site-field`, `site-search`. Label: `site-label`. Card: `site-glass-card`, `site-glass-dark`, `site-panel`, `site-white-card`. Badge: pill/chip spans → `<Badge variant="unstyled">`; `badge.tsx` got the same stock-base split and `unstyled` passthrough.
    - Batch 2 results: 22 public files converted, 0 raw form elements left, 75 named-variant conversions verified with `cn`. Before/after screenshots of 20 public routes at 1440 and 360 px are identical, except 2 anti-aliased pixels on the home sparkline (Recharts timing). Interaction test passed: mobile menu, skills search/tabs, research tabs, and contact fields, with no console errors.
    - `native-select` was added. Its design variants render a plain `<select>` so the browser-native look is kept.
    - All 28 admin files are converted by a scripted pass: 0 raw elements remain, and 329 design-variant conversions were verified with the real `cn` to produce identical class sets. One `block…flex` label was kept as `unstyled`. Before/after screenshots of 18 admin routes at 1440 and 360 px are pixel-identical; the one difference traced to the owner's own uncommitted removal of the resume editor's Preview button.
17. **Image fields: upload from device or paste URL** (2026-09-24). `components/admin/image-source-field.tsx` (`ImageSourceField`, built from shadcn Button/Input with admin variants) offers two alternatives, and switching discards the other option's value.
    - **Upload:** click or drag and drop; JPG/PNG/WebP/GIF/AVIF; **max 5 MB**, with inline errors. The file is previewed through a `blob:` object URL (revoked on replace or unmount), and `onChange(value, file)` receives the `File` for the Phase 5 Supabase Storage upload. **Nothing persists yet.**
    - **URL:** paste an http(s) URL; an optional thumbnail is shown.
    - **Used in:** Website → Home (hero photo), Website → About (profile photo), Profile (the "+" on the photo reveals the chooser; `photo` was added to the Profile data type, and `emptyProfile.photo` is `""`), Projects (cover), Portfolio Gallery (image), and eBooks (cover, replacing the inert "Drag & drop" placeholder; new books no longer get a stock cover, and the list shows a neutral box when there is none).
    - **Not yet covered:** Certificates, Experience, and Education have no image field in their forms; new entries still get a stock Unsplash image/logo on add (leftover sample data).
18. **Contact form → email only; no admin Messages inbox** (2026-09-24, owner). Submissions are emailed via Resend to **`mdtarakesiddique@gmail.com`** (env `CONTACT_TO_EMAIL`) with Reply-To = the visitor; they are **not stored** and there is no `Message` entity. Removed: `/admin/messages` route, `AdminMessages.tsx`, the sidebar link, the dashboard Messages card and "View Messages" quick action, and the placeholder `messages` array in `lib/data`. PRD §5.19/§6/§7/§10, phases 2.x/5.x/6.2, and architecture §4.3 updated. `docs/rules.md` (owner's file) still lists "Messages" among data models; flagged, not edited. The Contact page UI is unchanged (the form is still UI-only until Phase 6).
19. **Admin-editable site colours** (2026-09-25, owner). New `/admin/website/colours` (`AdminWebsiteColors.tsx`, sidebar Website → Colours). **Site-wide only** (owner: "one change will reflect every page"): navbar, footer, page top (dark hero header), and page body. Each has a colour picker plus a hex field (6-digit applies while typing, `#rgb` on blur, invalid reverts on blur), a per-colour reset, "Reset all", a WCAG low-contrast warning (< 4.5 against the text drawn on it), and a live preview. **Save is UI-only until Phase 5** (owner choice).
    - `lib/site-colors.ts`: `SiteColors` type, `defaultSiteColors` (the design's exact colours: `#040d1f`, `#0a1628`, `#040d1f`, `#eef4ff`), `normalizeHex`, `contrastRatio`, `siteColorVars`/`siteColorCss`.
    - `components/portfolio/SiteColorStyle.tsx` renders the `--site-*` CSS variables in `app/(public)/layout.tsx` and `app/not-found.tsx`. **Phase 5:** pass the saved colours as its `colors` prop.
    - Public components use `bg-(color:--site-navbar)/…` (Navbar), `bg-(color:--site-footer)` (Footer), and `from-(color:--site-top) via-(color:--site-top-mid) …` on the heroes of 14 pages, plus the headers of Certificate/Research/Book detail and the 404. Body: `background: var(--site-body-bg, var(--gradient-body))` in globals.css.
    - At defaults the derived stops are exact (`#071428` mid, `var(--color-blue-950)` for the eBook header end). Custom colours derive them via `color-mix`, and a custom body colour is a solid background (the default keeps the soft gradient).
    - **Deliberately unchanged:** Home's light hero, navy headings/text, active filter pills, and in-page navy CTA/resume panels.
    - Verified: pixel diff against HEAD on 20 public routes at 1440/360 px is 0 px; custom colours apply on the public pages; the admin interaction test passes; tsc, lint (0 errors), and build pass.
20. **Admin de-duplication: every field has one home** (2026-09-25, owner: "remove this kind of duplicate things").
    - **Papers:** Research Papers, Publications and Working Papers were the same thing. They are now one `/admin/research/papers` list (built from the former Publications screen: status filter + PDF box) with statuses `paperStatuses` in `lib/data` (Working Paper → Submitted → Under Review → Revision Requested → Accepted → Published), an Authors field, and Version / Submission Date / SSRN-preprint URL shown only while not Accepted/Published. "Upcoming" was dropped as a paper status: upcoming work belongs in **Upcoming Topics** (`/admin/research/upcoming`), which stays separate because it holds research plans (question, methodology, expected year), not papers. Removed `/admin/publications`, `/admin/research/working`, `AdminPublications.tsx`, `AdminResearchWorking.tsx`, and the `WorkingPaper` entity. Public status badge maps gained Accepted / Revision Requested and lost Upcoming.
    - **Certificates:** the four routes (academic, professional, training, awards) rendered the same screen. Now one `/admin/certificates` with a category filter; `certificateCategories` in `lib/data` feeds both the admin form and the public `/certificates` tabs. Sidebar entry is a single link.
    - **Profile:** name, photo, badge, headline, summary, location, email and hero stats are edited only in `/admin/profile`. Removed from Website → Home (badge, name, sub-headline, summary excerpt, photo; the public Home already truncates the Profile summary) and Website → About (identity card, photo, professional summary).
    - **Research:** interests only in Research Interests (removed from Profile); Scholar metrics only in Research Profile (removed from Profile).
    - **Links:** every social/academic link only in Settings, which gained ResearchGate and ORCID. Removed from Website → Footer and Research Profile.
    - Trimmed screens show a `SharedFieldsNote` (`components/admin/shared-fields-note.tsx`) linking to the screen that owns those fields.
    - Dashboard: the Publications stat card was removed (7 cards); certificate links point to `/admin/certificates`.
    - Not changed (distinct, not duplicates): Portfolio Gallery vs Media Library, Navigation vs Footer quick links, Home "Stats Strip" toggle vs Profile hero stats. Known leftover: removed admin URLs fall through to the `[...slug]` generic page rather than a 404 or redirect.
    - Verified: tsc, lint (0 errors), build pass; browser test of the merged papers form (status-dependent fields, filter), certificate category filter, all trimmed screens, public `/certificates` tabs; no console errors.

21. **Phase 5/6 build choices** (2026-09-25; made by Claude inside the approved architecture, so the owner can review them):
    - **Kept the ported controlled-state forms** instead of rewriting them to shadcn `Form`/react-hook-form (decision 11 mentioned it). This keeps the design identical and adds no dependency; zod validates on the server (and on the client for the contact form).
    - **Resend over plain `fetch`** (no `resend` SDK). **Auth as Server Actions**, not `/api/auth/*` Route Handlers.
    - **Languages** (the resume's Language entity had no admin screen) are edited in a card on `/admin/profile`; no new route.
    - **Pick-lists now come from owner data:** project categories = Portfolio → Categories (FK), paper and upcoming-topic areas = Research Interests, eBook category = free text with suggestions. The "Sample Category"/"Research Area" placeholder lists are gone.
    - **Portfolio Gallery** items are shown in a "Gallery" section on public `/portfolio` (only when any exist). The public pages previously had nowhere to show them.
    - **Removed fabricated or placeholder content:** the eBook detail's fake "4.0 · 48 readers" rating, sample table of contents, stock author photo and bio, and price labels (eBooks are free); stock profile photos (a neutral placeholder icon now shows until a photo is uploaded); Achievements' hard-coded "2024–2026"/"3+" stats (now computed); "Placeholder… Replace it" hero sentences (now neutral first-person copy, and "your X" became "my X").
    - Inert buttons now work or are hidden when there is no data: certificate Download/Verify/Copy ID, project link, paper Read/PDF/DOI copy/APA + BibTeX, eBook Download/Preview/Share, and the admin View/Download icons.
    - **Certificates** gained image upload, a "verified" checkbox and a verification URL. **Experience** gained responsibilities, achievements and logo fields; **Education** gained a logo field.
    - The Home editor's "Research Interests" toggle is relabelled **"Recent Research"**, because that is the section it controls.
    - **Resume "Download PDF" is browser print** (Save as PDF, A4 print CSS), confirmed by the owner (decision 22).
    - Security: 8-hour absolute admin session; new passwords need at least 12 characters; login is limited to 10 attempts per 15 minutes; contact to 5 per hour.

22. **Owner answers, 2026-09-25 (after the Phase 5/6 build):**
    - **Resume PDF = browser print** (Save as PDF with the A4 print stylesheet). No `puppeteer-core`/`@sparticuz/chromium` and no `app/api/resume/export`. This replaces the headless-Chromium plan in decision 12; PRD, architecture and phases were updated.
    - **Contact email:** the owner only needs to receive the messages. `CONTACT_TO_EMAIL` is the Resend account's own address, so Resend's test sender (`onboarding@resend.dev`) delivers without a verified domain. A real test through `/api/contact` was accepted by Resend. Domain verification (7.6) is optional and only needed for a custom sender address.
    - **DB types:** "do it yourself". Docker needed sudo and `supabase login` needs a browser, so types are generated from the live schema by `scripts/gen-db-types.mts` (`npm run db:types`; adds `postgres` as a dev dependency).
    - **Admin account:** the owner set the real `ADMIN_EMAIL` in `.env`. `npm run seed:admin` created it, its login was verified in the browser, and the old `admin@gmail.com` user was **deleted**. Supabase Auth now holds only the owner's account. Note that `ADMIN_PASSWORD` is shorter than the 12 characters the Settings screen requires for *new* passwords; sign-in still works.

23. **Senior code-quality review (2026-09-25)**, requested by the owner. Fixes:
    - **Uploads work on Vercel:** direct-to-Storage signed uploads (see §2a); the old flow would fail for files over ~4.5 MB in production. Verified with a 6 MB PDF, a spoofed PDF (rejected and removed), a forged path (rejected) and an anonymous request (401).
    - **Session expiry during a save was a silent failure.** Two causes: `proxy.ts` redirected the Server Action's POST to the login page, and a thrown `redirect()` is lost in event-handler actions. Now the proxy redirects only GET/HEAD navigations, actions return `{ ok: false, code: "unauthenticated" }` (`lib/actions/result.ts`), and `useAction` shows the message and routes to `/admin/login`.
    - **Security headers** in `next.config.ts` (HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy) and `poweredByHeader: false`. There is **no CSP yet**: the pages use inline styles (the site-colour `<style>`, chart CSS), so a strict CSP needs nonce plumbing. This is a Phase 7 follow-up.
    - **Link fields** reject protocol-relative `//host` and `/\host`, which browsers treat as external links.
    - **Unknown `/admin/*` paths** show an admin 404 inside the shell (`(shell)/not-found.tsx`); the catch-all "coming soon" `AdminGeneric` page was deleted. Added `app/global-error.tsx` for failures in the root or public layout.
    - **Accessibility:** eBook cards no longer nest buttons inside a link (stretched-link pattern; Download/Preview are real links). The admin sidebar toggle and the collapsed icon-only links/buttons have accessible names. The non-functional notification bell was removed.
    - **Lint:** `@next/next/no-img-element` turned off with a documented reason (owner-supplied image URLs from any host), and `.kilo/**` ignored. Lint now reports **0 problems**. Dead exports were removed (`getSettingsMap`, `ContactInput`) and file-local symbols un-exported; `deleteMedia`'s duplicate auth check was removed.
    - **`.env.example`** was added (variable names only; `.gitignore` now has `!.env.example`).

24. **Remaining-features build (2026-09-26)**, following the review's architecture:
    - **Public:** animated Home counters (`components/portfolio/count-up.tsx`, final value server-rendered, reduced motion respected); Portfolio card hover/focus overlay with View + Link (stretched-link pattern); Contact hero social links; Research hero = Publications/Citations/h-index/i10-index (PRD 3.1). The About "Resume & CV" card stays removed (owner's commit `ed76358`).
    - **Admin:** "Choose from library" media picker in image and PDF fields (`media-picker.tsx`, `listMedia` action); in-browser image optimisation before upload (`optimize-image.ts`: max 2000 px, WebP q0.85, only when smaller; raw photos up to 25 MB, 5 MB still enforced on the result); Experience/Education ordering via `ReorderButtons` (+ generic `reorder()` action; new entries go to the top); row expand toggles are real buttons; all 72 admin labels linked to their controls via `useId`.
    - **Caching bug found and fixed:** Next stores fetches made while prerendering static pages in the Data Cache, which survives rebuilds and is restored between Vercel deployments. A segment `revalidate` also turns every fetch into a cache entry. So server Supabase clients now send `x-deployment-id` (`dataCacheHeaders` in `lib/db/env.ts`; `VERCEL_DEPLOYMENT_ID`), making each deployment start with fresh data, and the public layout has **no** segment `revalidate`. Admin writes still purge via `revalidatePath`. Locally, delete `.next/cache` to force fresh data.
    - **CSP without nonces** in `next.config.ts` (the Next.js guide says nonces force every page dynamic): scripts/styles limited to self (+ inline), images from https, `connect-src` and `object-src`/`frame-src` limited to the Supabase origin, `frame-ancestors 'none'`, `form-action 'self'`, `upgrade-insecure-requests` on Vercel only. zod runs `jitless` in the browser (`lib/data/contact.ts`) so its eval probe isn't reported as a CSP violation.
    - **Performance:** Recharts sparkline lazy-loaded on Home (`home-sparkline.tsx` via `next/dynamic`, `ssr: false`); Inter (fallback font only) no longer preloaded; `loading="lazy"` on list/card images.
    - **Print:** the infographic no longer pushes its whole body to page 2 (section-level `break-inside-avoid` replaced by item-level; headings `break-after-avoid`).
    - **Verification:** Playwright + axe + Lighthouse against `next start` with temporary "E2E" fixtures (all deleted afterwards; DB empty): feature suite 14/14; Firefox suite 9/9 (1440/360 px, menu, tabs, contact, admin, upload); keyboard focus visible on every tab stop; axe shows 0 non-contrast violations; Lighthouse mobile: best practices 100, accessibility 92–94, performance 89–97, LCP 2.6–3.5 s (simulated slow 4G), CLS 0.

---

## 6. Rejected: Kilo "Prisma + TanStack" plan

`.kilo/plans/1790116508000-supabase-prisma-tanstack-plan.md` (by a Kilo Code agent) proposed Prisma as the ORM and TanStack Query/Form for the admin. **The owner rejected it on 2026-09-23** in favour of the plain Supabase client (decision 11). Do not follow that plan file. It is kept only as history in the untracked `.kilo/` folder.

---

## 7. Open questions and known doc conflicts

0. **Resolved 2026-09-25** (decision 22): resume PDF (browser print), contact delivery (Resend test sender to the owner's own address), DB types (generated), admin account (real email; old user deleted). **Still open:** the owner should confirm the test message arrived (check spam, since it comes from `onboarding@resend.dev`); optionally lengthen `ADMIN_PASSWORD`; optionally add `.kilo/` to ESLint's ignores.
1. **GitHub URL:** the owner will create and provide it. Until then, hide the GitHub icon/link; never guess a URL.
2. **Domain name:** the exact Namecheap domain (needed for the Resend sender, Phase 6, and DNS, Phase 7). The notification address is settled: `mdtarakesiddique@gmail.com` (decision 18).
3. **Supabase credentials for Phase 5.** The owner keeps them in the gitignored `.env`; never paste them in chat or commit them. The project uses Supabase's **new API keys**: publishable `sb_publishable_…` replaces anon, and secret `sb_secret_…` replaces service_role. Legacy anon/service_role keys are **not used**. Present as of 2026-09-23: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_DB_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. `SUPABASE_SECRET_KEY` added and verified 2026-09-23. **All Phase 5 credentials are present.** Suggestion given to the owner: lengthen `ADMIN_PASSWORD` (currently short) before the Phase 5 admin seed. CLI auth: the owner runs `npx supabase login` in Phase 5 (no `SUPABASE_ACCESS_TOKEN` stored). The same runtime vars go in Vercel project settings.

---

## 8. Completed work

- Scaffold confirmed: Next.js 16.3.5, React 19.2.8, TS 5, Tailwind v4, ESLint 9, Geist fonts.
- Docs written: PRD, phases, architecture, design, rules, memory. AGENTS.md is the canonical agent guide.
- Decisions recorded: Supabase platform, no analytics, no 2FA.
- 2026-09-23 doc consistency pass (see the session log).

**Progress (phases.md, 2026-09-25):** Phase 1 17/24 · Phase 2 41/45 · Phase 3 24/26 · Phase 4 11/16 · Phase 5 35/38 · Phase 6 26/30 · Phase 7 3/27. Items were ticked only with e2e or visual evidence.

## 9. Pending work and next steps

**Current (2026-09-26):**

- **Needs owner decisions:**
  - **Colour contrast:** 334 elements fall below WCAG AA, all from the ported palette. Main pairs: slate-500 text on the navy footer/heroes (3.8:1), slate-400 on white or light cards (2.5–2.6:1), dim decorative numbers (slate-200 on white). Fixing means changing design colours; needs approval.
  - **Automated tests:** a test framework plus a separate test database (Supabase branch or second project). The Playwright/axe scripts currently live only in the session scratchpad and write to the live DB.
  - **Deployment (7.6):** Vercel project and env vars, Namecheap DNS, CI/CD, backups, error/uptime monitoring. Also 1.1's Git branching strategy.
  - **1.2 / 5.3:** extract reusable design-system components (Hero, StatCard, …) plus a demo page, and generic CRUD components? The ported design keeps these inline by owner instruction. Decide whether these tracker items are still wanted.
- **Owner checks:** confirm the contact test email arrived; open an eBook's "Read online" in real Chrome, Firefox and Safari (automation browsers can't show inline PDFs); test on a real iPhone/Android.
- **After deploy:** re-run Lighthouse and LCP behind Vercel's CDN; WebKit/Safari and Edge runs.
- Minor, by design: uploads abandoned before saving a form stay in the Media Library (deletable there); signed-but-never-finalised files could remain in Storage without a library row (rare).
- The owner enters real content through the admin.

**Older notes (before 2026-09-25):**

- **Ported UI vs. the PRD:** the ported pages cover most Phase 1–4 page UIs and the Phase 5–6 admin screens _visually_, but `docs/phases.md` tasks have **not** been ticked. Each needs checking against its PRD requirement first. Known gaps:
  - `/research` tabs are local state, not the P0 `?tab=` deep link.
  - The contact form is UI only (Phase 6).
  - Resume PDF export is not implemented (Phase 4: headless Chromium).
  - The eBook "Read online" PDF viewer is not built yet.
  - Admin screens are local-state mocks: **nothing persists**, and the login accepts any non-empty email/password (**no real auth** until Phase 5).
  - The GitHub link is a placeholder.
  - Navbar/Footer/Home content is not yet admin-driven (P1).
- **Next:** review the ported pages against the phases 1–4 checklists and tick what genuinely passes. Then continue with the remaining gaps, and Phase 5 (Supabase schema, auth, CRUD wiring that replaces the local-state mocks).

## 10. Blockers

- Real content no longer blocks Phases 1–4: the owner will enter it through the admin (decision 8). Until then, the UI runs on clearly marked placeholders that look nothing like real data.

---

## 11. Working agreements (essentials from AGENTS.md and rules.md)

- Read this file first. For a new phase, read all six `docs/` files and the relevant Next.js guide in `node_modules/next/dist/docs/`.
- **Update `docs/memory.md` after every work session.** Also update `docs/phases.md` checkboxes only after the Definition of Done is verified.
- Do exactly what the owner asks. Ask before any architecture, DB, auth, API, dependency, third-party service, or route decision. Don't add unrequested features or libraries.
- Never invent personal, research, or contact data.
- Before calling something done, run `npm run lint`, `npm run build`, and `npx tsc --noEmit`, then check at 360 px and desktop, keyboard and focus behaviour, and reduced motion.
- Don't commit unless asked. Never commit `.env`.
- Server Components by default, `"use client"` only when needed. Next 16: `params` and `searchParams` are async.

---

## 12. Session log

Newest last. Add one entry per work session.

- **2026-09-21:** Initial Create Next App scaffold.
- **2026-09-22:** Docs added (PRD, phases, architecture, design, rules, memory). Supabase decision made; analytics removed.
- **2026-09-23 (Claude Code), doc review:** memory.md rewritten as the full-context handoff.
  - **PRD:** reframed the "track visitor engagement" goal (no tracking). Updated the §9 tech stack to Next.js 16 (dropped Vite/React Router). Moved SSR and no-analytics to Resolved Decisions. Added open Q5 (top-pages data / §3 metrics). Noted that `lib/data/index.ts` does not exist yet.
  - **phases.md:** fixed the duplicate §2.6 numbering (Portfolio → 2.8, Contact → 2.9) and recounted the progress table (counts now include DoD items).
  - **architecture.md:** corrected the seed path to `lib/data/index.ts`, noted the Supabase keys in `.env`, added AGENTS.md to the tree, and made memory updates routine rather than "on request".
  - **AGENTS.md:** removed the analytics routes and folders, the stale "rules.md is empty" and `src/data` notes, and recorded Supabase as the chosen platform.
  - **design.md:** added a Next.js adaptation note.
  - No application code changed.
- **2026-09-23 (Claude Code), manual content:** the owner supplied their LinkedIn, Google Scholar, and ResearchGate URLs (§4) and decided that all content is entered manually through the admin with no automatic fetching (decision 8).
  - **PRD:** added a no-import non-goal (§1.5), placeholder-seed wording (§7), and assumptions plus the owner's profile URLs (§13).
  - **phases.md:** task 1.4 now specifies placeholder seed data.
  - Added open questions 9 (GitHub vs. ResearchGate icon) and 10 (whether to seed production). Removed the "no real content" blocker.
- **2026-09-23 (Claude Code), owner answers:** GitHub stays in the navbar and the owner will supply its URL (open Q9 now pending the URL). The DB starts from the placeholder seed, also in production, and the owner overwrites it via the admin (decision 9: the seed is idempotent and never clobbers owner edits). Updated PRD §13 and phases.md 5.1 and 7.5. Old open Q10 removed.
- **2026-09-23 (Claude Code), owner answers 2:** fonts and colours follow design.md (decision 10), so AGENTS.md, architecture §6.1/§11.4, design.md, PRD §5.3/§13 Q4, and phases 1.1/1.2 were updated. Footer navy is now `#040d1f`. 2FA was removed from phases 7.4 (Phase 7 count 30 → 29). The owner asked which data layer is better and whether to add visitor tracking; Claude gave recommendations (open Q1/Q2).
- **2026-09-23 (Claude Code), data layer and tracking:** the owner accepted both recommendations. Decision 11: plain Supabase client with Server Actions and zod; Kilo's Prisma/TanStack plan rejected. Decision 3 updated: no tracking, anonymous `DownloadStat` counts, content-per-section chart instead of top pages. PRD §3 dropped time-on-site and bounce-rate. PRD §6.2, §7 (+`DownloadStat`), §9, and §13 were updated, along with architecture §5.2/§6.4/§7.3/§11, phases 5.1/5.4 (Phase 5 count 39 → 40) plus a backlog item, design.md §6, and AGENTS.md (admin API route removed from the tree; data-layer rules added). No application code changed.
- **2026-09-23 (Claude Code), owner answers 3:** decision 12 recorded: name wordmark instead of a logo; free PDF eBooks read on-site (price removed); English only; resume PDF via headless Chromium; Resend for email; DB empty plus an admin seed script. Updated PRD §1.5, §5.2, §5.16, §5.17, §6.3, §7, §9, and §13; architecture §3.2, §5.3, §6.4, and §11; phases 1.3, 3.5, 4.3 (Phase 4 count 16 → 17), 5.2, 5.5, and 6.2; and AGENTS.md (`lib/email/`). Open questions are now the GitHub URL, custom domain, and hosting target.
- **2026-09-23 (Claude Code), hosting and domain:** Vercel hosting; Namecheap custom domain with no mailbox (Resend sends via DNS verification). Updated PRD §9 and §13, architecture §2 and §6.4 (resume PDF → `puppeteer-core` + `@sparticuz/chromium`; Resend DNS setup), phases 7.6 (Phase 7 count 29 → 30), and memory decision 12. Open questions: GitHub URL, exact domain name, and notification address.
- **2026-09-23 (Claude Code), Phase 1 setup:** initialized shadcn 4.21 (Radix, Nova) and installed the design.md component set (`field` instead of the removed `form`; `next-themes` dropped from Sonner; use-mobile lint fix). Wrote the design.md theme into `app/globals.css` and the design.md fonts into the root layout. Created the `(public)` and `(admin)/admin` route groups with placeholder pages for all 50 PRD routes, a root not-found, and `.gitkeep` lib/public folders. Removed the starter SVGs and the owner's `hello` page (moved into `(public)`). Lint, build, and tsc pass. Ticked phases 1.1 (4 tasks) and 1.2 (colour tokens). Updated AGENTS.md, architecture §3.1/§6.3, and design.md. The owner asked which Supabase credentials are needed (answered in chat; see §7).
- **2026-09-23 (Claude Code), Supabase keys:** the owner switched to the new publishable key. Env names are now `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` (docs updated; legacy anon/service_role keys unused). `SUPABASE_SECRET_KEY` is still missing from `.env`.
- **2026-09-23 (Claude Code):** verified that `.env` has all six Phase 5 vars with the correct key types (no values read); `.env` is gitignored.
- **2026-09-23 (Claude Code), admin seed:** installed `@supabase/supabase-js` and added `scripts/seed-admin.mts` plus the `seed:admin` npm script. Ran it: connected, admin user created. Re-ran it: idempotent. Ticked phases 5.2 (the admin seed task; Phase 5 now 1/40). Flagged that `admin@gmail.com` is likely not the owner's inbox.
- **2026-09-23 (Claude Code), design port:** ported the owner's Vite design source into Next.js (see §2): router conversion, route wiring with `(shell)` admin group and Training/Awards routes, placeholder data plus a prose sweep (the source described another person), globals.css aligned to the source `index.css` (radius, links, headings, transitions, glass), Analytics/Visitors removed, lint errors fixed (types, escaping, lucide `Image` → `ImageIcon`, unused imports, `Math.random` in render), and a 404 hydration fix. Verified by tsc, lint, build, and side-by-side Playwright screenshots against the source (tooling in the session scratchpad only). PRD/AGENTS/architecture updated for Training/Awards and the port.
- **2026-09-23 (Claude Code), SEO removed:** deleted `components/admin/pages/AdminSEO.tsx`, `app/(admin)/admin/(shell)/seo/`, and the sidebar link. PRD: removed §6.7 (Media → 6.7, Settings → 6.8), the SEOEntry entity, the SEO NFR, the SEO acceptance criterion, the SPA-SEO risk, and `/admin/seo` in the sitemap; the Lighthouse target is now Performance/Accessibility; added a Resolved Decision. phases: removed 6.6 SEO and three 7.5 SEO tasks (Phase 6 count 41 → 37, Phase 7 count 30 → 27). architecture/AGENTS updated (also fixed AGENTS' stale "no Supabase dependency" line). Decision 14.
- **2026-09-23 (Claude Code), admin trims:** removed the Academic/Research CVs (public tabs and research block, admin tabs, sidebar, two routes). Settings is reduced to Links + Password. The whole admin now starts empty (`emptyProfile`, empty typed lists, new empty states, dashboard zeros, resume-editor sliders max 10/50), and the database starts empty (decision 9 revised). Docs updated (PRD §1.3/§5.17/§6.4/§6.8/§7/§10/§13/§14, phases 4.x/5.1/6.3/6.7/7.5 with counts Phase 4 17 → 16 and Phase 6 37 → 33, architecture, AGENTS). Verified with tsc, lint (0 errors), build (48 pages), and screenshots with no console errors. Open: the removed admin URLs fall through to the generic catch-all page instead of a 404; the category/area pick-lists still hold "Sample Category" options; the Settings links duplicate the Footer editor's links; the admin login still shows the public placeholder name.
- **2026-09-24 (Claude Code), shadcn batch 1:** converted the admin panel to shadcn components with design variants (see decision 16). tsc, lint (0 errors), and build pass; the pixel diff is identical. Noted owner edits made outside this session: commit `ed76358` (About page refactor) and an uncommitted removal of the resume editor's Preview button plus reformatting (kept as-is). Next: batch 2, the public pages.
- **2026-09-24 (Claude Code), shadcn batch 2:** public pages, Navbar, and Footer converted to shadcn (Button incl. asChild links, Input, Textarea, Label, Card, Badge) with `site-*` design variants. tsc, lint (0 errors), and build pass; the pixel diff is identical and the interaction test passed. Decision 16 is complete.
- **2026-09-24 (Claude Code), image upload:** added `ImageSourceField` (upload or URL) to six admin screens (decision 17). Browser-tested: txt and 6 MB files rejected, PNG upload previewed on all six screens, URL mode works, no console errors. tsc and lint are clean.
- **2026-09-24 (Claude Code), messages removed:** owner decision 18: contact submissions go straight to `mdtarakesiddique@gmail.com` via Resend; the admin Messages module (route, component, sidebar link, dashboard card and quick action, placeholder data) was removed and the docs updated. Added `CONTACT_TO_EMAIL` to `.env`. Told the owner what Resend needs: an API key, and the domain verified with DNS records at Namecheap for the sender address.
- **2026-09-25 (Claude Code), site colours:** added the admin Colours editor and the CSS-variable wiring on the public site (decision 19). PRD §6.6/§14, phases 6.x (Phase 6 count 33 → 34), architecture, and AGENTS updated.
- **2026-09-25 (Claude Code), admin de-duplication:** merged Papers/Publications/Working Papers and the four certificate screens; gave profile, research and link fields one home each (decision 20). PRD §6/§7/§14, phases (Phase 5 count 40 → 38, Phase 6 34 → 33), architecture, and AGENTS updated.
- **2026-09-25 (Claude Code), Phase 5/6 build:** the owner asked to "make the website functional and complete the phases".
  - Built the Supabase backend: migration, RLS, buckets and types; server-only clients; auth with proxy, guard, 8-hour session, lockout and password change; zod-validated Server Actions for every admin module; media upload, contact (Resend) and eBook download-counter routes.
  - Wired all 25 admin screens and all 20 public routes to live data, with dashboard charts and activity, the research `?tab=` deep link, the eBook in-site reader, citations, resume config rendering with print-to-PDF, and error/loading boundaries.
  - Verified with 3 Playwright e2e stages on the live DB, then deleted all test data (the DB is empty). tsc, lint (0 errors) and build pass.
  - Updated phases.md (ticks and table), memory (§2a, decision 21, §7, §9), AGENTS.md and architecture.md. Nothing committed.
- **2026-09-25 (Claude Code), owner answers:** browser print accepted as the resume PDF; contact delivery confirmed via Resend's test sender (a real message was accepted); DB types now generated from the live schema (`scripts/gen-db-types.mts`, `postgres` dev dependency); admin account moved to the owner's real email and the old `admin@gmail.com` deleted. PRD, architecture and phases updated (Phase 4 14/16, Phase 6 27/30). tsc, lint and build pass.
- **2026-09-25 (Claude Code), senior review:** reviewed the whole codebase and fixed what matters (decision 23): Vercel-safe signed uploads, the silent session-expiry save, security headers, link hardening, admin 404, global error boundary, public revalidate safety net, a11y fixes, lint cleanup (0 problems), dead code, `.env.example`. Verified with a review e2e suite (13 checks) plus the earlier suites; all test data and Storage objects were removed. tsc, lint and build pass.
- **2026-09-26 (Claude Code), login error flash fixed:** the owner saw an error for a moment on a correct sign-in. Cause: the `login` Server Action ended with `redirect("/admin")`, which throws `NEXT_REDIRECT`; the login form's `try/catch` showed it as "Could not reach the server" before Next navigated. `login` now returns `ok(null)`, and `AdminLogin` calls `router.replace("/admin")` inside the transition. Rule for this codebase: **never `redirect()` from a Server Action that the client awaits inside `try/catch`**; return an `ActionResult` and navigate on the client (logout's `redirect` is fine because it is a plain `<form action>`). Verified in a browser: no error flash on a correct login, wrong password still errors, sign-out works. tsc, lint (0) and build pass.
- **2026-09-26 (Claude Code), remaining features:** built the open public items (counters, portfolio overlay, contact hero socials, research hero stats) and admin items (media picker, image optimisation, experience/education ordering, keyboard toggles, label linking). Hardening: a CSP without nonces, lazy images, lazy Recharts, Inter not preloaded, infographic print fix, zod `jitless` in the browser. Found and fixed a Data Cache staleness bug (per-deployment cache key; segment `revalidate` removed). Verified with Playwright (Chromium + Firefox), axe, Lighthouse and multi-page print, then deleted all fixtures (DB empty). phases.md: Phase 2 and Phase 4 are complete; tracker 17/24 · 45/45 · 25/26 · 16/16 · 37/38 · 29/30 · 8/27. tsc, lint (0) and build pass.
- **2026-09-26 (Claude Code), comma-separated fields fixed:** seven admin list fields (Experience skills; Education coursework and skills; Project technologies and tools; Paper authors and keywords) re-parsed the text on every keystroke, split on commas, trimmed and joined it back, so a typed comma or space vanished instantly. Added `components/admin/list-input.tsx` (`ListInput`): it keeps the raw text while typing, reports the parsed list to the form, and re-syncs when another entry loads. The Experience skills label was also linked to its input. Certificate skills, upcoming-topic keywords and About domain expertise already kept raw text. Verified in a browser (14/14: typing, saving, split items, edit, append); only the test rows ("E2E List …") were deleted. **The owner has started entering real content** (about 23 rows across the modules plus settings); it was left untouched, so future test runs must not bulk-delete tables, only rows they created. tsc, lint (0) and build pass.

