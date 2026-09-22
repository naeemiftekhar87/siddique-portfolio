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

Read `docs/memory.md` first, then the remaining files in the order listed when beginning a new feature or phase. Do not skip a file because it is currently empty. `docs/architecture.md` now documents the target architecture; keep `docs/memory.md` updated as work completes or plans change, including completed work, pending work, decisions, and blockers. `docs/rules.md` remains intentionally empty.

When documentation conflicts with the checked-in repository, inspect the repository first and report the conflict before changing the architecture. In particular, adapt the design guide to the actual Next.js App Router structure instead of copying its Vite/React Router paths.

Before writing code, also read the relevant Next.js guide under `node_modules/next/dist/docs/` for the feature being changed. This project uses Next.js 16, so do not rely on older App Router examples without checking the installed documentation.

## Current project state

- Next.js `16.3.5` with the App Router.
- React `19.2.8` and TypeScript.
- Tailwind CSS v4 with `@tailwindcss/postcss`; styling is rooted in `app/globals.css`.
- The application code is currently under `app/`; there is no `src/` directory.
- The repository is a minimal scaffold: it currently contains `app/page.tsx`, `app/layout.tsx`, and `app/globals.css`, plus the standard Next.js configuration files.
- The target is a full-stack Next.js application. The Phase 5 backend must be implemented inside this application with Route Handlers, Server Actions where appropriate, and server-only data/auth modules; do not introduce a separate Express or Vite backend.
- There is no backend implementation, database, authentication layer, API client, shadcn component library, or configured test framework yet.
- The PRD mentions a static seed-data source at `src/data/index.ts`, but that file does not currently exist. Do not import it until it has been created or the data layer has been deliberately established.
- The PRD's long-term goal is to replace static content with persistent data in Phase 5. Do not pretend that admin edits persist before that work exists.

## Product scope

The product has two surfaces:

- A responsive public portfolio for recruiters, researchers, institutions, readers, and collaborators.
- A protected single-owner admin panel for content, resume configuration, media, messages, SEO, analytics, and site settings.

Treat `P0` requirements as launch-critical, `P1` as required after the core flow, and `P2` as future work unless the user explicitly changes the priority. Do not implement non-goals from the PRD, including multi-tenant hosting, checkout/payments, a blog/newsletter, native mobile apps, or automatic Scholar/ORCID sync, unless they are moved into the active scope.

Use `docs/phases.md` as the execution tracker. A phase is not complete until its implementation, acceptance criteria, and definition of done are verified. When a phase task is completed, update the corresponding checkboxes and progress table in `docs/phases.md`; never mark work complete based only on code being written.

## Commands

```bash
npm run dev       # Start the Next.js development server
npm run build     # Run a production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Run the TypeScript check; there is no package script for it
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
    admin/.../route.ts
    media/route.ts
    analytics/route.ts
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
    admin/certificates/professional/page.tsx
    admin/certificates/academic/page.tsx
    admin/projects/page.tsx
    admin/publications/page.tsx
    admin/research/papers/page.tsx
    admin/research/profile/page.tsx
    admin/research/interests/page.tsx
    admin/research/upcoming/page.tsx
    admin/research/working/page.tsx
    admin/ebooks/page.tsx
    admin/messages/page.tsx
    admin/analytics/page.tsx
    admin/resume/professional/page.tsx
    admin/resume/academic/page.tsx
    admin/resume/research/page.tsx
    admin/resume/infographic/page.tsx
    admin/portfolio/gallery/page.tsx
    admin/portfolio/categories/page.tsx
    admin/website/home/page.tsx
    admin/website/about/page.tsx
    admin/website/navigation/page.tsx
    admin/website/footer/page.tsx
    admin/seo/page.tsx
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
  resume/
  analytics/
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
- Use React Server Component metadata exports (`metadata` or `generateMetadata`) for public-page SEO.
- Use `next/image` for local and remote portfolio imagery, with meaningful alt text and explicit dimensions or `fill` where required.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` where a route needs a real loading, failure, or missing-record state.
- Do not add React Router, Vite, Express, or another frontend framework to this Next.js project.

## Design and UI conventions

The visual target is defined by `docs/design.md`: deep navy heroes, cyan accents, amber highlights, light public surfaces, glassmorphism, and a separate dark admin theme.

- Keep brand and semantic values in `app/globals.css` using Tailwind v4 `@theme`/`@theme inline` tokens. Do not create a Tailwind config unless a concrete dependency or tooling requirement makes it necessary.
- Do not hard-code repeated hex colors in components when a token or semantic utility exists.
- Use the public light theme for portfolio pages and dark navy hero sections. Use the admin dark theme for `/admin` and its layouts.
- The design guide refers to `src/index.css`, `index.html`, and Vite conventions. Adapt those instructions to `app/globals.css` and the Next.js root layout; do not create Vite files.
- The design guide proposes several web fonts. The current scaffold uses `next/font/google` with Geist. Do not silently replace the font system or add external font links without resolving the brand-font decision in the PRD. When fonts are chosen, use Next.js font optimization and keep the public/admin typography rules from the design guide.
- Use semantic HTML, keyboard-accessible controls, visible focus states, ARIA only where native semantics are insufficient, and `prefers-reduced-motion` support.
- Make every page usable at 360 px width without horizontal scrolling.
- Use shadcn/ui only when it is actually installed. The current repository does not contain `components/ui/` or a shadcn configuration. If a feature needs a missing component, either use the existing project primitives and theme tokens or deliberately initialize/install it and follow the installed component conventions. Do not claim a component exists before checking.
- Reuse components for heroes, cards, badges, chips, tabs, accordions, filters, dialogs, tables, navigation, and resume sections. Keep route-specific markup in route components.

## Data, backend, and admin conventions

- Define TypeScript types for every PRD entity before creating forms or API contracts.
- During Phases 1–4, a typed in-memory or seed-data layer is acceptable only if it is clearly identified as temporary and drives the public UI consistently.
- In Phase 5, choose and document the database/storage approach before implementing endpoints. The backend is part of this Next.js application: use Route Handlers for explicit APIs and Server Actions where appropriate, with server-only `lib/db/` and `lib/auth/` modules. The PRD permits PostgreSQL or a BaaS; do not mix incompatible persistence systems without a documented reason.
- Keep public reads separate from protected writes. Validate and sanitize all admin input, authorize every mutation, and never expose credentials or private environment variables to the client.
- Use the existing typed data as the seed/migration source only after confirming the file and schema actually exist.
- Admin routes under `/admin/*` must be protected. Implement login, session expiry, logout, password hashing, brute-force protection, and two-step confirmation for destructive actions before exposing CRUD workflows.
- Public pages must reflect admin changes after a refresh or within the documented cache TTL.
- Treat media uploads, contact messages, resume exports, SEO records, and analytics as separate bounded areas with explicit validation and failure states.

## Required product areas

Follow the PRD sitemap and requirements rather than inventing alternate routes. The public surface includes:

- Home, About, Experience, Education, Skills, Achievements.
- Certificates and certificate details.
- Portfolio and project details.
- Research, research details, publications, and upcoming research.
- eBooks and eBook details.
- Professional, Academic, and Research resume views, plus the infographic resume and PDF export.
- Contact and the catch-all 404 page.

The admin surface includes authentication, dashboard, content CRUD, research management, messages, resume editors, portfolio management, website editors, SEO, media, analytics, and settings as listed in `docs/PRD.md`.

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
