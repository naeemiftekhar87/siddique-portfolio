<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Guide — Siddique Portfolio

This is the canonical guide for agents working in this repository. `CLAUDE.md` points to this file.

The project is an academic and professional portfolio with a single-owner admin CMS. It is a full-stack Next.js application: the public site, admin UI, server-side business logic, authentication, API endpoints, and data access live in the same Next.js application and repository. Build the product in the order and scope defined by the repository documentation. Do not reuse assumptions, routes, data models, or architecture from another project.

## Documentation rules

Before starting any implementation, first read `docs/memory.md` for the project context, completed work, pending work, retained decisions, and current state. Treat it as the primary handoff/context file; do not infer project status from code alone.

Then read the relevant documentation. For a new feature or phase, read all six files in `docs/`:

1. `docs/memory.md` — canonical project context, completed work, pending work, decisions, and current state.
2. `docs/PRD.md` — product scope, priorities, entities, requirements, acceptance criteria, and sitemap.
3. `docs/phases.md` — ordered build tracker and definition of done for each phase.
4. `docs/design.md` — visual system, tokens, typography, glass effects, public theme, and admin theme.
5. `docs/architecture.md` — architecture decisions and constraints.
6. `docs/rules.md` — repository rules and agent constraints.

Read `docs/memory.md` first, then the remaining files in the order listed when beginning a new feature or phase. `docs/architecture.md` documents the target architecture and `docs/rules.md` holds the owner's behavioural rules for agents (scope, approvals, no fabricated personal/research data). Keep `docs/memory.md` updated after every work session and whenever plans change, including completed work, pending work, decisions, and blockers.

When documentation conflicts with the checked-in repository, inspect the repository first and report the conflict before changing the architecture. In particular, adapt the design guide to the actual Next.js App Router structure instead of copying its Vite/React Router paths.

Before writing code, also read the relevant Next.js guide under `node_modules/next/dist/docs/` for the feature being changed. This project uses Next.js 16, so do not rely on older App Router examples without checking the installed documentation.

## Current project state

- Next.js `16.3.5` with the App Router.
- React `19.2.8` and TypeScript.
- Tailwind CSS v4 with `@tailwindcss/postcss`; styling is rooted in `app/globals.css`.
- The application code is currently under `app/`; there is no `src/` directory.
- **The owner's design source has been ported** (2026-09-23) from the Vite project at `/mnt/FR-project/Build Website from Shard File/`. Public page UIs live in `components/portfolio/pages/` (plus `Navbar.tsx`, `Footer.tsx`), admin UIs in `components/admin/pages/`, and route files in `app/(public)/` and `app/(admin)/admin/` are thin wrappers. Admin modules sit under the `(shell)` group (sidebar layout); `/admin/login` is outside it. **The owner requires the ported design to stay exactly as the source**: do not restyle these components, and keep `app/globals.css`'s base layer mirroring the source `index.css`. See `docs/memory.md` §2.
- The target is a full-stack Next.js application. The Phase 5 backend must be implemented inside this application with Route Handlers, Server Actions where appropriate, and server-only data/auth modules; do not introduce a separate Express or Vite backend.
- shadcn/ui is initialized (`components.json`: Radix base, Nova preset, Lucide icons) with the design.md component set in `components/ui/`. In this shadcn version `form` is replaced by `field`. There is no configured test framework.
- **The Supabase backend exists (2026-09-25)** and the whole site is database-driven; see `docs/memory.md` §2a. The schema is in `supabase/migrations/`. Server-only clients are in `lib/db/` (`public.ts`, `server.ts`, `admin.ts`), with types generated from the live schema into `lib/db/database.types.ts` (`npm run db:types`). Auth is in `lib/auth/` plus `proxy.ts`. Reads are in `lib/data/queries.ts`, writes in the `lib/actions/` Server Actions, and there are Route Handlers for media, contact and eBook downloads. Media uploads go browser → Supabase Storage through a signed URL (`/api/media/sign`), then `/api/media` verifies the file; never stream file bodies through a Route Handler or Server Action (Vercel caps request bodies at ~4.5 MB). Required env vars are listed in `.env.example`.
- `lib/data/index.ts` exports only client-safe types and constants. The placeholder seed data is gone, and **the database starts empty**: the owner enters all content through the admin. Never add real-looking personal or research data.
- **Caching rules:** public pages are static and re-rendered by `revalidatePath` after admin writes. Do not add a segment-level `revalidate` to public routes, because it turns every Supabase fetch into a Data Cache entry that survives rebuilds. Server Supabase clients send `dataCacheHeaders` (a per-deployment cache key) so each deployment starts with fresh data. Security headers and the CSP (no nonces, so pages can stay static) live in `next.config.ts`; any new external origin must be added there.
- Every admin write goes through `mutate()` (`lib/actions/helpers.ts`): `requireAdmin()` → zod → write → `revalidatePath("/", "layout")`. New content screens should follow the same pattern: load the data in the server `page.tsx`, pass it as props, and save through a Server Action.

## Product scope

The product has two surfaces:

- A responsive public portfolio for recruiters, researchers, institutions, readers, and collaborators.
- A protected single-owner admin panel for content, resume configuration, media, messages, and site settings. There is no analytics module or visitor tracking.

Treat `P0` requirements as launch-critical, `P1` as required after the core flow, and `P2` as future work unless the user explicitly changes the priority. Do not implement non-goals from the PRD, including multi-tenant hosting, checkout/payments, a blog/newsletter, native mobile apps, or automatic Scholar/ORCID sync, unless they are moved into the active scope.

Use `docs/phases.md` as the execution tracker. A phase is not complete until its implementation, acceptance criteria, and definition of done are verified. When a phase task is completed, update the corresponding checkboxes and progress table in `docs/phases.md`; never mark work complete based only on code being written.

## Commands

```bash
npm run dev       # Start the Next.js development server
npm run build     # Run a production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Run the TypeScript check; there is no package script for it
npm run db:push   # Apply supabase/migrations to the hosted DB (reads .env)
npm run db:types  # Regenerate lib/db/database.types.ts from the live schema
npm run seed:admin # Create/update the single admin user from ADMIN_EMAIL/ADMIN_PASSWORD
```

There is no configured test command and no test framework. Do not claim that tests pass unless a test command has been added and run. Do not use commands from the copied guide that are not present in `package.json`, such as `npm run typecheck`, `npm run format`, or `npm run icons:generate`.

## Folder and file conventions

Keep the existing root-level App Router structure. Do not introduce `src/`, Pages Router files, or a second routing system unless the user explicitly requests a migration.

Recommended organization as the product grows:

```text
app/
  layout.tsx
  page.tsx
  globals.css
  api/
    auth/login/route.ts
    auth/logout/route.ts
    contact/route.ts
    media/route.ts
    resume/export/route.ts
  (public)/
    page.tsx
    about/page.tsx
    experience/page.tsx
    education/page.tsx
    skills/page.tsx
    achievements/page.tsx
    certificates/page.tsx
    certificates/[id]/page.tsx
    portfolio/page.tsx
    portfolio/[id]/page.tsx
    research/page.tsx
    research/[id]/page.tsx
    research/upcoming/page.tsx
    publications/page.tsx
    ebooks/page.tsx
    ebooks/[id]/page.tsx
    resume/page.tsx
    resume/infographic/page.tsx
    contact/page.tsx
    not-found.tsx
  (admin)/
    admin/login/page.tsx
    admin/page.tsx
    admin/profile/page.tsx
    admin/experience/page.tsx
    admin/education/page.tsx
    admin/skills/page.tsx
    admin/achievements/page.tsx
    admin/certificates/page.tsx
    admin/projects/page.tsx
    admin/research/papers/page.tsx
    admin/research/profile/page.tsx
    admin/research/interests/page.tsx
    admin/research/upcoming/page.tsx
    admin/ebooks/page.tsx
    admin/messages/page.tsx
    admin/resume/professional/page.tsx
    admin/resume/infographic/page.tsx
    admin/portfolio/gallery/page.tsx
    admin/portfolio/categories/page.tsx
    admin/website/home/page.tsx
    admin/website/about/page.tsx
    admin/website/navigation/page.tsx
    admin/website/footer/page.tsx
    admin/website/colours/page.tsx
    admin/media/page.tsx
    admin/settings/page.tsx
components/
  ui/
  portfolio/
  admin/
lib/
  data/
  api/
  auth/
  db/
  storage/
  email/
  resume/
public/
docs/
```

Route groups are optional organizational tools and do not change URLs. Use them only when they clarify separate public and admin layouts. Use `page.tsx` for pages, `layout.tsx` for shared UI, `not-found.tsx` for missing content, and `route.ts` under `app/api/` for API endpoints. Use `[id]` for dynamic detail routes.

Create `components/`, `lib/`, and nested route folders only when there is code that belongs there. Do not create empty scaffolding merely to match a diagram.

## React and Next.js conventions

- Default to Server Components. Add `"use client"` only for browser-only state, event handlers, portals, or client hooks.
- Use `next/link` for internal navigation and semantic links for external navigation.
- In Next.js 16, treat `params` and `searchParams` as asynchronous values in Server Components and use the generated `PageProps`/`LayoutProps` helpers where useful.
- Keep data access and rendering concerns separate. Put reusable data access in `lib/`, not directly in many page components.
- Use `metadata` exports only for plain page titles. There is no SEO module (no meta editing, Open Graph, sitemap, robots, or JSON-LD); do not add one unless the owner asks.
- Use `next/image` for local and remote portfolio imagery, with meaningful alt text and explicit dimensions or `fill` where required.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` where a route needs a real loading, failure, or missing-record state.
- Do not add React Router, Vite, Express, or another frontend framework to this Next.js project.

## Design and UI conventions

The visual target is defined by `docs/design.md`: deep navy heroes, cyan accents, amber highlights, light public surfaces, glassmorphism, and a separate dark admin theme.

- Keep brand and semantic values in `app/globals.css` using Tailwind v4 `@theme`/`@theme inline` tokens. Do not create a Tailwind config unless a concrete dependency or tooling requirement makes it necessary.
- Do not hard-code repeated hex colors in components when a token or semantic utility exists.
- Use the public light theme for portfolio pages and dark navy hero sections. Use the admin dark theme for `/admin` and its layouts.
- The design guide refers to `src/index.css`, `index.html`, and Vite conventions. Adapt those instructions to `app/globals.css` and the Next.js root layout; do not create Vite files.
- Fonts follow `docs/design.md` (owner decision, 2026-09-23): DM Serif Display (headings), Plus Jakarta Sans (body, Inter fallback), and JetBrains Mono (data). They replace the scaffold's Geist fonts. Load them with `next/font/google` in `app/layout.tsx`, not `<link>` tags, and keep the public/admin typography rules from the design guide.
- Use semantic HTML, keyboard-accessible controls, visible focus states, ARIA only where native semantics are insufficient, and `prefers-reduced-motion` support.
- Make every page usable at 360 px width without horizontal scrolling.
- **All UI elements use shadcn components** (owner decision, 2026-09-24): `Button`, `Input`, `Textarea`, `NativeSelect`, `Label`, `Card`, `Badge`, and `Table*` from `components/ui/`. Button-styled links use `<Button asChild variant="site-…"><Link …/></Button>`. Do not write raw `<button>`, `<input>`, `<textarea>`, `<select>`, `<label>`, or `<table>` elements. To keep the ported design pixel-identical, these components have **design variants** (e.g. `Button variant="admin-primary"`, `Input variant="admin-field"`, `Card variant="admin-panel"`) holding the design's exact classes and no shadcn base styles, plus `variant="unstyled"`, which passes `className` through untouched. Layout and spacing go in `className`. To restyle something everywhere, edit the variant in `components/ui/`. Design variants set `data-design`, which excludes them from the global shadcn border default in `app/globals.css`. Stock variants (`default`, `outline`, …) keep shadcn's look for new UI.
- shadcn/ui is installed (Radix base, Nova preset). Check `components/ui/` before using a component; add missing ones with `npx shadcn@latest add <name>` and follow the installed conventions. `components/ui/sonner.tsx` takes an explicit `theme` prop (no `next-themes`), and `hooks/use-mobile.ts` was rewritten with `useSyncExternalStore` to satisfy the React hooks lint rule; keep both changes if you re-add those components.
- Reuse components for heroes, cards, badges, chips, tabs, accordions, filters, dialogs, tables, navigation, and resume sections. Keep route-specific markup in route components.

## Data, backend, and admin conventions

- Define TypeScript types for every PRD entity before creating forms or API contracts.
- During Phases 1–4, a typed in-memory or seed-data layer is acceptable only if it is clearly identified as temporary and drives the public UI consistently.
- In Phase 5, choose and document the database/storage approach before implementing endpoints. The backend is part of this Next.js application: use Route Handlers for explicit APIs and Server Actions where appropriate, with server-only `lib/db/` and `lib/auth/` modules. Supabase (Postgres, Storage, Auth) is the chosen platform, accessed with the plain Supabase client (`@supabase/supabase-js` + `@supabase/ssr`). Do not add Prisma or TanStack Query/Form. Admin CRUD uses Server Actions with zod validation, and schema changes are Supabase CLI SQL migrations with generated types and RLS on every table. Do not mix incompatible persistence systems without a documented reason.
- Keep public reads separate from protected writes. Validate and sanitize all admin input, authorize every mutation, and never expose credentials or private environment variables to the client.
- Use the existing typed data as the seed/migration source only after confirming the file and schema actually exist.
- Admin routes under `/admin/*` must be protected. Implement login, session expiry, logout, password hashing, brute-force protection, and two-step confirmation for destructive actions before exposing CRUD workflows.
- Public pages must reflect admin changes after a refresh or within the documented cache TTL.
- Treat media uploads, contact messages, and resume exports as separate bounded areas with explicit validation and failure states.

## Required product areas

Follow the PRD sitemap and requirements rather than inventing alternate routes. The public surface includes:

- Home, About, Experience, Education, Skills, Achievements.
- Certificates and certificate details.
- Portfolio and project details.
- Research, research details, publications, and upcoming research.
- eBooks and eBook details.
- The Professional resume view, plus the infographic resume and PDF export (the Academic and Research CVs were removed).
- Contact and the catch-all 404 page.

The admin surface includes authentication, dashboard, content CRUD, research management, messages, resume editors, portfolio management, website editors, media, and settings as listed in `docs/PRD.md`.

## Quality and completion checklist

Before reporting a feature or phase complete:

1. Read all six `docs/` files and the relevant installed Next.js guide.
2. Confirm the implementation matches the active phase and PRD priority.
3. Run `npm run lint`, `npm run build`, and `npx tsc --noEmit`.
4. Check the route at desktop and 360 px mobile widths.
5. Check keyboard navigation, focus states, labels, alt text, loading/error/empty states, and reduced-motion behavior.
6. Verify internal links, dynamic detail routes, invalid IDs, metadata, and responsive navigation.
7. Verify that no temporary seed data is presented as persistent storage.
8. Update `docs/phases.md` only for work that has actually passed its definition of done.
9. Do not commit changes unless the user explicitly requests a commit.

## Repository boundaries

This guide intentionally does not carry over the copied project's election dashboard, candidate APIs, notification/socket system, report-export system, role trees, Creato font assumptions, or generated icon registry. Add those only if the PRD and user explicitly require them; they are not part of this portfolio project.
