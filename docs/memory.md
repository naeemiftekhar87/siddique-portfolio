# Project Memory

> **Read this first.** It is the canonical handoff file: it should give a new agent enough context to start work without re-reading the whole repo. Update it at the end of every work session (the "Session log" and any section whose facts changed).
>
> **Last updated:** 2026-09-23

---

## 1. What this project is

A personal **academic + professional portfolio** for a single owner (Siddique), with a built-in **single-owner admin CMS**. The owner enters data once in the admin, and it drives the public site, four resume variants (Professional, Academic CV, Research CV, Infographic) with PDF export, and SEO metadata.

- **Public site:** 20 routes for recruiters, researchers, institutions, and readers.
- **Admin panel:** `/admin/*`, a login plus about 29 management screens: content CRUD, research, messages, resume editors, portfolio, website editors, SEO, media, and settings.
- **Out of scope for v1:** multi-tenant use, eBook payments, a blog or newsletter, native apps, any automatic import or sync from LinkedIn/Scholar/ResearchGate/ORCID, analytics or visitor tracking, and 2FA (removed from the PRD on 2026-09-23).

---

## 2. Tech stack and repo state

| Item         | Value                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Framework    | Next.js **16.3.5**, App Router, root-level `app/` (no `src/`)                                      |
| UI           | React 19.2.8, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/postcss`, tokens in `app/globals.css`)  |
| Fonts        | Scaffold still has Geist; **decided:** switch to design.md fonts via `next/font/google` in Phase 1 |
| Lint         | ESLint 9 + `eslint-config-next`                                                                    |
| Tests        | **None configured.** Do not claim tests pass.                                                      |
| Commands     | `npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`                              |
| Path alias   | `@/*` → repo root                                                                                  |
| Next.js docs | `node_modules/next/dist/docs/` (read before coding; v16 differs from older examples)               |

**Current code (as of 2026-09-23, after the Phase 1 setup session):**

- `app/layout.tsx`: the single root layout. Loads DM Serif Display, Plus Jakarta Sans, Inter, and JetBrains Mono via `next/font/google` (CSS variables `--font-dm-serif`, `--font-plus-jakarta`, `--font-inter`, `--font-jetbrains-mono`). Wraps children in `TooltipProvider`. Default metadata is neutral ("Academic & Professional Portfolio"); the owner's name comes later from Profile/SEO data.
- `app/globals.css`: the full design.md theme, adapted: brand `@theme` tokens, font stacks in `@theme inline`, light `:root`, `.admin-theme` dark overrides, shadcn mapping, Nova radius scale, and base plus glass/hero/navbar classes. It imports `tw-animate-css` and `shadcn/tailwind.css`.
- `app/(public)/layout.tsx`: a `<main>` wrapper (Navbar/Footer are still Phase 1 tasks). There are placeholder pages for all 19 public routes (`components/portfolio/page-placeholder.tsx`). Dynamic `[id]` pages use `PageProps` and await `params`.
- `app/(admin)/admin/layout.tsx`: a dark `admin-theme dark` wrapper (dark on the server render) plus `components/admin/admin-html-theme.tsx` (client), which adds the classes to `<html>` for portals. Metadata is noindex. There are placeholder pages for all 31 admin routes (`components/admin/admin-placeholder.tsx`). **None of them are protected yet** (auth comes in Phase 5).
- `app/not-found.tsx`: a minimal 404 (the full design is a Phase 1 task).
- **shadcn:** `components.json` (Radix base, **Nova** preset, Lucide, `cn` package from shadcn). `components/ui/` has the design.md §1.2 set, with `field` in place of `form` (which no longer exists in shadcn 4.x). Local edits: `sonner.tsx` takes an explicit `theme` prop (`next-themes` was removed), and `hooks/use-mobile.ts` uses `useSyncExternalStore` (lint fix). The design.md §3 variant edits (button `glass`, badge category/status variants, `font-mono` tabs) are **not applied yet**.
- **Admin seeded early (2026-09-23, at the owner's request, to verify the Supabase connection):** `scripts/seed-admin.mts` (`npm run seed:admin`, which runs Node 24 native TS with `--env-file=.env`) creates the single Supabase Auth user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, sets `email_confirm: true` and `app_metadata.role = "admin"`, and warns if other auth users exist. It is idempotent: re-runs change nothing unless `-- --reset-password` is passed. It ran successfully; the admin user exists (1 auth user total). **Concern raised with the owner:** `ADMIN_EMAIL` is `admin@gmail.com`, which is probably not an inbox the owner controls, so password-reset or security email would go to a stranger. Suggested switching to a real address and re-seeding (no database schema exists yet; only Auth was touched).
- **Dependencies added:** `@supabase/supabase-js` (2.117), `radix-ui`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn`, `tw-animate-css`, `sonner`, `recharts`.
- **Empty folders (`.gitkeep`):** `lib/{data,api,auth,db,storage,email,resume}/` and `public/{images,documents,icons}/`. The Create Next App SVGs were removed.
- **Checks:** `npm run lint`, `npm run build`, and `npx tsc --noEmit` pass. The routes were smoke-tested on `next start` (200s, 404 for unknown paths, admin noindex and dark). **Not yet checked visually** at 360 px or on desktop.
- `.env` (gitignored via `.env*`) holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`. `@supabase/supabase-js` is installed; there are no `lib/db` clients yet.
- `.kilo/` (untracked) holds Kilo Code agent state (see §6).

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

**Admin routes:** `/admin/login`, `/admin` (dashboard), profile, experience, education, skills, achievements, certificates/{professional,academic}, projects, publications, research/{papers,profile,interests,upcoming,working}, ebooks, messages, resume/{professional,academic,research,infographic}, portfolio/{gallery,categories}, website/{home,about,navigation,footer}, seo, media, settings.

**Entities (PRD §7):** Profile, Experience, Education, Skill, Achievement, Certificate, Project, ResearchPaper/Publication, UpcomingResearch, WorkingPaper, Language, eBook, Message, ResumeConfig, PortfolioCategory, NavItem/FooterConfig/PageConfig, SEOEntry, MediaAsset, AdminUser, DownloadStat (anonymous daily download counts).

**Seed data target (Phase 1, `lib/data/index.ts`):** 1 profile, 6 experiences, 2 education, 38 skills, 15 certificates, 4 projects, 6 papers, 4 languages, 5 eBooks, 12 achievements, 6 messages. All entries are **clearly marked placeholders** because the owner enters real content through the admin (decision 8). Per `docs/rules.md` §19–20, never invent realistic-looking personal or research data (jobs, degrees, DOIs, citation counts, and so on).

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
6. Advanced admin (research mgmt, messages, resume editors, website editors, SEO, media, settings).
7. Hardening and launch.

---

## 5. Key decisions (confirmed)

1. **Full-stack Next.js in one repo.** Route Handlers under `app/api/` and Server Actions; no Express, Vite, React Router, or separate API repo. Deploy on a Node server runtime, not static export.
2. **Supabase for data, media, and auth (Phase 5).** Postgres is the source of truth for entities, Storage holds media (only URLs and metadata go into Postgres), and Supabase Auth provides email/password login with cookie sessions. Server-only access sits behind `lib/db/` and `lib/storage/`, and the secret key (`sb_secret_…`) never reaches the client. Mixing in another persistence system needs a written decision record.
3. **No analytics module and no visitor tracking** (reconfirmed 2026-09-23). There is no `/admin/analytics`, `/api/analytics`, `lib/analytics/`, page views, time on site, or bounce rate. The dashboard has 9 stat cards (Experience, Degrees, Skills, Certificates, Projects, Research Papers, Publications, eBooks, Unread Messages) plus two Recharts charts: **content items per section** (bar), which replaced "top pages", and **downloads over time** (area). Downloads come from the `DownloadStat` entity: anonymous daily counts per resume variant or eBook, with no IP, cookie, or visitor ID. A cookieless hosted analytics tool (Plausible, Umami, Vercel) is only a post-launch backlog idea and needs owner approval.
4. **No 2FA.** It was removed from PRD §6.1 and phases.md §7.4 by the owner (2026-09-23).
5. Single owner and admin, with no public accounts. Content is in English. Scholar metrics are entered manually in v1.
6. Route groups `(public)` and `(admin)` are organizational only, and URLs match PRD §14.
7. Phases 1–4 use typed temporary seed data in `lib/data/`, clearly marked as temporary and never presented as persistent.
8. **All content is entered manually by the owner through the admin dashboard** (decided 2026-09-23). There is no automatic fetching, scraping, API import, or sync from LinkedIn, Google Scholar, ResearchGate, ORCID, or any other source. That covers profile, experience, papers, and Scholar metrics (citations, h-index, i10-index). The seed data in `lib/data/index.ts` is therefore **clearly marked placeholder content** that exists only to build and test the UI. The only real values it may contain are the profile URLs above. Real content arrives once the Phase 5 admin CRUD exists (phases.md 7.5).
9. **The database starts from the placeholder seed** (decided 2026-09-23). The Phase 5 seed script loads the `lib/data/index.ts` placeholders into Supabase, including production. The owner then overwrites or replaces each record through the admin. Consequences:
   - The seed must be idempotent and must never overwrite rows the owner has already edited. For example, it runs only on an empty DB or upserts only untouched seed rows. Re-running it after launch must not clobber real content.
   - Placeholders must be obviously fake (e.g. "Sample Company", "Example Paper Title") so nothing can be mistaken for real data before the owner replaces it.

10. **Design follows `docs/design.md`** (decided 2026-09-23). Fonts are DM Serif Display, Plus Jakarta Sans (Inter fallback), and JetBrains Mono, loaded via `next/font/google` and replacing Geist. Colours come from design.md tokens; the footer uses the `navy` token (`#040d1f`), not the PRD's old `#0a1628`. The PRD and phases were updated to match.

11. **Data layer: plain Supabase client** (decided 2026-09-23; the Kilo Prisma + TanStack plan was rejected).
    - `@supabase/supabase-js` + `@supabase/ssr` in server-only `lib/db/` modules. There is a cookie-aware client for the admin session and a service-role client for writes, used only after the session is verified.
    - No Prisma, TanStack Query, or TanStack Form.
    - Schema is Supabase CLI SQL migrations (`supabase/migrations/`) with generated TypeScript types. RLS is on for every table: public content gets read-only policies; messages, stats, and config have none.
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
    - **Database:** the Supabase DB is **empty**. Migrations create the schema, the content seed loads placeholders (decision 9), and an **admin seed script** creates the single Supabase Auth user through the Admin API from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. It is idempotent and the credentials are never committed.
    - **Hosting: Vercel** (2026-09-23). Use the Node.js runtime for routes that use the service-role client, Resend, or Chromium. The resume PDF uses `puppeteer-core` + `@sparticuz/chromium` (needs approval in Phase 4; watch Vercel's function size and duration limits). Rate limits for login and contact must be stored in Supabase, not in memory. Env vars live in Vercel project settings.
    - **Domain:** a custom domain is registered at **Namecheap**, with **no mailbox**. It points to Vercel via DNS, and Resend sends from it after SPF/DKIM/DMARC records are added at Namecheap (no mailbox needed to send). Contact notifications go to the owner's personal address, with Reply-To set to the visitor.
    - **Env vars still to add** (to the gitignored `.env`): `RESEND_API_KEY` (Phase 6), plus `ADMIN_EMAIL` and `ADMIN_PASSWORD` (Phase 5).

---

## 6. Rejected: Kilo "Prisma + TanStack" plan

`.kilo/plans/1790116508000-supabase-prisma-tanstack-plan.md` (by a Kilo Code agent) proposed Prisma as the ORM and TanStack Query/Form for the admin. **The owner rejected it on 2026-09-23** in favour of the plain Supabase client (decision 11). Do not follow that plan file. It is kept only as history in the untracked `.kilo/` folder.

---

## 7. Open questions and known doc conflicts

1. **GitHub URL:** the owner will create and provide it. Until then, hide the GitHub icon/link; never guess a URL.
2. **Domain name and notification address:** the exact Namecheap domain, and which personal email should receive contact notifications. Needed by Phase 6 (Resend) and Phase 7 (DNS).
3. **Supabase credentials for Phase 5.** The owner keeps them in the gitignored `.env`; never paste them in chat or commit them. The project uses Supabase's **new API keys**: publishable `sb_publishable_…` replaces anon, and secret `sb_secret_…` replaces service_role. Legacy anon/service_role keys are **not used**. Present as of 2026-09-23: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_DB_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. `SUPABASE_SECRET_KEY` added and verified 2026-09-23. **All Phase 5 credentials are present.** Suggestion given to the owner: lengthen `ADMIN_PASSWORD` (currently short) before the Phase 5 admin seed. CLI auth: the owner runs `npx supabase login` in Phase 5 (no `SUPABASE_ACCESS_TOKEN` stored). The same runtime vars go in Vercel project settings.

---

## 8. Completed work

- Scaffold confirmed: Next.js 16.3.5, React 19.2.8, TS 5, Tailwind v4, ESLint 9, Geist fonts.
- Docs written: PRD, phases, architecture, design, rules, memory. AGENTS.md is the canonical agent guide.
- Decisions recorded: Supabase platform, no analytics, no 2FA.
- 2026-09-23 doc consistency pass (see the session log).

**Phase 1: 5 of 24 tasks done** (project init, tokens and fonts, ESLint and folders, route placeholders, colour tokens). Git branching and `.env` handling are not done yet.

## 9. Pending work and next steps

- **Next (Phase 1):** apply the design.md §3 shadcn variant edits (button `glass`, badge variants, mono filter tabs), then build the shared components (Hero, StatCounter, SectionHeading, CTA band, filters), Navbar, Footer, the full 404, scroll-to-top, entity types, and `lib/data/index.ts` placeholder seed data. Visually check at 360 px and on desktop.
- Update root `metadata` in `app/layout.tsx` (still "Create Next App") during Phase 1.

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
