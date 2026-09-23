# Project Architecture

## 1. Purpose and status

This document defines the architecture for the Siddique academic and professional portfolio. It is the technical reference for the public portfolio, the single-owner admin CMS, the full-stack application boundary, the data lifecycle, and the phased migration from a static scaffold to a persistent product.

This is a **full-stack Next.js project**. The public site, admin UI, server-side business logic, authentication, API endpoints, data access, and deployment unit live in the same Next.js application and repository. A database, object storage, or email provider may be external dependencies, but they are not a separate frontend/backend codebase.

The repository currently contains a minimal Next.js App Router scaffold. The architecture below distinguishes the current baseline from the target structure so that future work does not assume that the backend, database, authentication, or UI component library already exists.

## 2. Architectural principles

- Use the existing root-level Next.js App Router structure under `app/`; do not introduce `src/`, Pages Router files, React Router, Vite, Express, or a second routing system unless the user explicitly requests a migration.
- Keep the frontend and backend in one Next.js application. Do not create a separate API repository or service for the Phase 5 backend.
- Prefer Server Components for public content, metadata, and initial data access. Use Client Components only for browser state, forms, filters, accordions, dialogs, and other interactions.
- Use Next.js Route Handlers for explicit REST-style endpoints and Server Actions for page-bound form mutations when that model is clearer. Do not implement the same operation through both without a documented reason.
- Keep presentation, data access, domain logic, authentication, and persistence in separate layers.
- Maintain one source of truth for profile, career, research, portfolio, resume, website, media, and site configuration data.
- Keep public reads separate from protected admin writes.
- Build in the order defined by `docs/phases.md`; do not implement Phase 5 persistence or Phase 6 admin modules before their prerequisites exist.
- Treat `P0` requirements as launch-critical, `P1` as required after the core flow, and `P2` as future work.
- Use semantic HTML, keyboard navigation, visible focus states, meaningful image alternatives, and `prefers-reduced-motion` support.
- Keep the public experience responsive at 360 px without horizontal scrolling.
- **Hosting is Vercel** (decided 2026-09-23) with the owner's Namecheap domain. Use the Node.js runtime (not Edge) for routes that use the Supabase service-role client, Resend, or headless Chromium. Server state does not persist between serverless invocations, so rate limits (login, contact) must live in Supabase or a Vercel feature, not in memory. Environment variables are set in the Vercel project settings. A static-only export is not suitable for authenticated API routes, database access, or server-side mutations.

## 3. System architecture

### 3.1 Current baseline

The checked-in application is a single Next.js application with:

- `app/layout.tsx` as the single root layout (design.md fonts via `next/font/google`, `TooltipProvider`, default metadata).
- `app/globals.css` with the design.md theme (brand tokens, light public theme, `.admin-theme` dark theme, glass/hero/navbar classes).
- `app/(public)/` (layout + placeholder pages for every public route) and `app/(admin)/admin/` (dark-theme layout, noindex, placeholder pages for every admin route). `app/not-found.tsx` is the minimal 404.
- `components/ui/` (shadcn, Radix base, Nova preset), `components/portfolio/` and `components/admin/` (placeholders and the admin `<html>` theme toggle), `hooks/use-mobile.ts`, and `lib/utils.ts`.
- Empty `lib/{data,api,auth,db,storage,email,resume}/` and `public/{images,documents,icons}/` folders (tracked with `.gitkeep`).
- No `src/` directory.
- No backend implementation, database client, authentication system, media storage, or configured test framework yet.

The PRD refers to a typed seed-data file at `lib/data/index.ts`, but that file is not present yet; it is created in Phase 1 (task 1.4). Do not import it or describe it as implemented until it exists. Supabase project credentials exist in the gitignored `.env` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`), but no Supabase client or schema has been written.

### 3.2 Full-stack target architecture

| Layer | Responsibility | Primary location |
| --- | --- | --- |
| Routing and page composition | URLs, layouts, route groups, metadata, loading/error/not-found states | `app/` |
| Public presentation | Portfolio pages, shared navigation, footer, cards, filters, resume views | `components/portfolio/` and route-local components |
| Admin presentation | Login, dashboard, dashboard charts, CRUD forms, media picker, settings | `components/admin/` |
| Shared UI | Reusable buttons, cards, badges, tabs, dialogs, tables, and layout primitives | `components/ui/` when shadcn is initialized |
| Application API | REST-style endpoints, request validation, authorization, response contracts | `app/api/.../route.ts` |
| Server mutations | Page-bound form actions, cache invalidation, redirects, and server-side validation | `app/.../actions.ts` or `lib/actions/` |
| Data access | Typed selectors, temporary seed data, API calls, caching, response contracts | `lib/data/` and `lib/api/` |
| Authentication and authorization | Session checks, admin route protection, password handling, logout | `lib/auth/` and protected route handlers |
| Database access | Schema queries, transactions, migrations, and persistence adapters | `lib/db/` |
| Media storage | Upload handling, object storage adapters, file metadata | `lib/storage/` |
| Resume logic | Resume configuration, variant selection, export preparation | `lib/resume/` |
| External integrations | Email delivery (Resend, `lib/email/`), resume PDF rendering (headless Chromium) | Bounded adapters behind `lib/` |

The layers should depend inward: pages and components call typed data-access functions; data-access functions call API, database, or storage adapters; persistence and external services never import UI components.

### 3.3 API design

- Put API endpoints under `app/api/`; their public URLs are `/api/...`.
- Use `GET` for public reads and authenticated reads, and `POST`, `PUT`, `PATCH`, or `DELETE` for protected mutations.
- Keep route handlers thin: authenticate, validate the request, call a server-only service or data-access function, and return a typed response.
- Keep database queries, transactions, and provider-specific code behind `lib/db/`.
- Keep media upload and object-storage code behind `lib/storage/`.
- Do not expose database records, credentials, private environment variables, or raw error details to the browser.
- Use a consistent error envelope and HTTP status codes across endpoints.
- A Route Handler and a page cannot occupy the same route segment. Keep API routes under the dedicated `app/api/` tree.

## 4. Application flow

### 4.1 Public visitor flow

```mermaid
flowchart LR
    V["Visitor browser"] --> R["Next.js App Router"]
    R --> P["Server Component page"]
    P --> D["Typed temporary data or same-app API"]
    D --> P
    P --> M["Metadata and next/image"]
    P --> H["HTML, CSS, and minimal client JavaScript"]
    H --> V
```

1. The browser requests a public URL such as `/research` or `/certificates/[id]`.
2. The App Router resolves the route group, dynamic segment, and page file.
3. A Server Component loads page data through the data-access layer.
4. During Phases 1–4, the data source may be typed temporary data. During Phase 5 and later, it should read through the same application's typed API or server-only data layer.
5. The page renders shared public layout elements, route content, metadata, and optimized images.
6. Client interactivity is limited to controls that require browser state, such as filters, tabs, accordions, search, and copy actions.

### 4.2 Admin flow

```mermaid
flowchart LR
    A["Owner browser"] --> G{"/admin/* request"}
    G -->|Unauthenticated| L["/admin/login"]
    G -->|Authenticated| S["Admin layout and route"]
    S --> F["Admin form or dashboard"]
    F --> API["Next.js Route Handler or Server Action"]
    API --> AUTH["lib/auth"]
    AUTH --> API
    API --> DB[("Database")]
    API --> OS[("Object storage")]
    DB --> API
    OS --> API
    API --> F
```

1. The owner opens `/admin/login` and submits credentials.
2. The authentication layer validates the credentials, creates a server-side session, and applies expiry and brute-force protection.
3. Every `/admin/*` route checks authentication before rendering protected content.
4. Admin forms validate input on the client and again in the server action or Route Handler.
5. Protected mutations persist content, configuration, messages, or media metadata.
6. Successful mutations invalidate or revalidate the affected public reads so changes appear after refresh or within the documented cache TTL.
7. Destructive actions require a separate confirmation step.

### 4.3 Contact flow

```mermaid
flowchart LR
    C["Public contact form"] --> V["Client validation and honeypot"]
    V --> E["Next.js contact Route Handler"]
    E --> R["Rate limit and server validation"]
    R --> M[("Message record")]
    R --> N["Optional owner email notification"]
    M --> I["Admin messages inbox"]
    N --> I
```

The contact form must not write directly to the database from the browser. The Next.js server endpoint is responsible for validation, sanitization, spam protection, persistence, and optional email delivery.

### 4.4 Resume flow

```mermaid
flowchart LR
    C["Shared profile and career data"] --> R["Resume configuration"]
    R --> P["Professional / Academic / Research view"]
    R --> I["Infographic view"]
    P --> X["PDF or print export"]
    I --> X
```

The two resume variants (Professional and Infographic; the Academic and Research CVs were removed on 2026-09-23) consume the same underlying content. `ResumeConfig` controls visibility, counts, accent color, typography, and custom notes. The export implementation must be selected deliberately: client print CSS or a server-side headless-browser renderer.

## 5. Route and folder structure

### 5.1 Current structure

```text
siddique-portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── docs/
│   ├── PRD.md
│   ├── phases.md
│   ├── design.md
│   ├── architecture.md
│   ├── rules.md
│   └── memory.md
├── public/
├── package.json
├── package-lock.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── AGENTS.md                         # canonical agent guide
└── CLAUDE.md                         # points to AGENTS.md
```

### 5.2 Target application structure

Route groups are organizational only and do not change the public URLs.

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── not-found.tsx
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── session/route.ts
│   ├── contact/route.ts
│   ├── media/route.ts
│   └── resume/export/route.ts
├── (public)/
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── experience/page.tsx
│   ├── education/page.tsx
│   ├── skills/page.tsx
│   ├── achievements/page.tsx
│   ├── certificates/page.tsx
│   ├── certificates/[id]/page.tsx
│   ├── portfolio/page.tsx
│   ├── portfolio/[id]/page.tsx
│   ├── research/page.tsx
│   ├── research/[id]/page.tsx
│   ├── research/upcoming/page.tsx
│   ├── publications/page.tsx
│   ├── ebooks/page.tsx
│   ├── ebooks/[id]/page.tsx
│   ├── resume/page.tsx
│   ├── resume/infographic/page.tsx
│   └── contact/page.tsx
└── (admin)/
    ├── admin/login/page.tsx
    ├── admin/page.tsx
    ├── admin/profile/page.tsx
    ├── admin/experience/page.tsx
    ├── admin/education/page.tsx
    ├── admin/skills/page.tsx
    ├── admin/achievements/page.tsx
    ├── admin/certificates/professional/page.tsx
    ├── admin/certificates/academic/page.tsx
    ├── admin/certificates/training/page.tsx
    ├── admin/certificates/awards/page.tsx
    ├── admin/projects/page.tsx
    ├── admin/publications/page.tsx
    ├── admin/research/papers/page.tsx
    ├── admin/research/profile/page.tsx
    ├── admin/research/interests/page.tsx
    ├── admin/research/upcoming/page.tsx
    ├── admin/research/working/page.tsx
    ├── admin/ebooks/page.tsx
    ├── admin/messages/page.tsx
    ├── admin/resume/professional/page.tsx
    ├── admin/resume/infographic/page.tsx
    ├── admin/portfolio/gallery/page.tsx
    ├── admin/portfolio/categories/page.tsx
    ├── admin/website/home/page.tsx
    ├── admin/website/about/page.tsx
    ├── admin/website/navigation/page.tsx
    ├── admin/website/footer/page.tsx
    ├── admin/media/page.tsx
    └── admin/settings/page.tsx
```

The `app/(public)` and `app/(admin)` groups may have separate layouts for the light public theme and dark admin theme. A route group must not be used to create a second routing system or to change the URLs in the PRD.

### 5.3 Shared code structure

```text
components/
├── ui/                              # shadcn components only after initialization
├── portfolio/                       # public portfolio primitives
└── admin/                           # admin shell, forms, tables, and dialogs

lib/
├── data/                            # entity types, selectors, temporary seed data
├── api/                             # typed API contracts and client helpers
├── auth/                            # session and authorization helpers
├── db/                              # database client, schema, migrations, repositories
├── storage/                         # media upload and object-storage adapters
├── resume/                          # resume configuration and export logic
├── email/                           # Resend adapter (server-only)

public/
├── images/
├── documents/
└── icons/

docs/
├── PRD.md
├── phases.md
├── design.md
├── architecture.md
├── rules.md
└── memory.md
```

Create these directories only when they contain code or assets. Do not create empty scaffolding merely to match the diagram.

## 6. Technology stack

### 6.1 Installed and active

| Area | Technology | Use |
| --- | --- | --- |
| Framework | Next.js `16.3.5` | App Router, Server Components, Route Handlers, server rendering, metadata, image optimization |
| UI runtime | React `19.2.8` and `react-dom` | Component rendering and client interactions |
| Language | TypeScript `5` | Strict application, API, and data contracts |
| Styling | Tailwind CSS `4` | Utility-first styling and design tokens |
| CSS processing | `@tailwindcss/postcss` | Tailwind processing for `app/globals.css` |
| Linting | ESLint `9` and `eslint-config-next` | Static checks and Next.js rules |
| Fonts | `next/font/google` with Geist and Geist Mono | Current scaffold font setup; to be replaced in Phase 1 |
| Path alias | `@/*` | Imports rooted at the repository root |
| Package manager | npm | Dependency and script execution |

The Geist setup is a scaffold placeholder. **Decided (2026-09-23):** the brand fonts follow `docs/design.md`: DM Serif Display (headings), Plus Jakarta Sans (body, Inter fallback), and JetBrains Mono (data). They are loaded through `next/font/google`.

### 6.2 Full-stack capabilities provided by Next.js

| Capability | Next.js mechanism |
| --- | --- |
| Server-rendered public pages | Server Components and App Router layouts/pages |
| API endpoints | `app/api/.../route.ts` Route Handlers |
| Server-side mutations | Server Actions or Route Handlers |
| Request and response handling | Web `Request`/`Response`, `NextRequest`, and `NextResponse` |
| Authentication boundaries | Server-only session checks in layouts, actions, and route handlers |
| Cache invalidation | `revalidatePath`, `revalidateTag`, `updateTag`, and route-level caching |
| Media handling | Server-side upload handlers backed by a storage adapter |
| PDF generation | Server-side rendering/print pipeline or client print CSS |
| Page titles | Server Component `metadata` exports (no SEO module) |

### 6.3 Not currently installed

The repository does not currently include:

- A database client or migration tool (Phase 5: `@supabase/supabase-js`, `@supabase/ssr`, Supabase CLI; no ORM).

- An authentication library or implemented session system.
- Form or schema-validation libraries (Phase 5: `react-hook-form` + `zod`, used with shadcn `field`).
- Media upload or object-storage integration.
- Email delivery integration.
- A configured test framework or test command.

shadcn/ui (with `radix-ui`, `lucide-react`, `sonner`, and `recharts` via the `chart` component) **is installed** as of 2026-09-23. Do not claim the capabilities above exist. Add them only when the relevant phase and user-approved architecture require them.

### 6.4 Phase-dependent choices

| Area | Allowed direction | Decision point |
| --- | --- | --- |
| Temporary data | Typed in-memory or seed-data module | Phase 1 |
| **Backend surface** | **Server Components for reads; Server Actions for admin CRUD; Route Handlers for auth, contact, media upload, resume export** — chosen | **Phase 5 — resolved** |
| **Data client** | **Plain `@supabase/supabase-js` + `@supabase/ssr`; no Prisma, no TanStack Query/Form** — chosen | **Phase 5 — resolved** |
| **Validation / forms** | **zod on the server; shadcn `Form` (react-hook-form + zod) in admin UIs** — chosen | **Phase 5 — resolved** |
| **Database** | **Supabase Postgres (hosted)** — chosen | **Phase 5 — resolved** |
| **Media storage** | **Supabase Storage (S3-compatible)** — chosen | **Phase 5 — resolved** |
| **Admin authentication** | **Supabase Auth (email/password + server-side sessions)** — chosen | **Phase 5 — resolved** |
| **Charts** | **Recharts via shadcn `Chart`** — chosen | **Phase 5 — resolved** |
| **Resume PDF** | **Server-side headless Chromium renders the resume route (A4 print CSS) in `app/api/resume/export/route.ts`**. Because hosting is Vercel, use `puppeteer-core` + `@sparticuz/chromium` (serverless-sized Chromium) on the Node.js runtime with a raised `maxDuration`; confirm the function stays under Vercel's bundle-size limit. Adding the packages still needs owner approval in Phase 4 | **Phase 4 — strategy resolved** |
| **Email** | **Resend** (`resend` SDK behind `lib/email/`; `RESEND_API_KEY` server-only). Sender domain: the owner's Namecheap domain, verified in Resend by adding its SPF/DKIM (and recommended DMARC) DNS records at Namecheap. No mailbox is needed to send. Notifications go to the owner's personal address, with Reply-To set to the visitor's email. Until the domain is verified, use Resend's test sender to the account email | **Phase 6 — resolved** |

The backend surface, database, storage, and authentication choices are resolved for Phase 5: **Supabase** provides the database (Postgres), object storage, and authentication. Do not mix Supabase Postgres/Storage with an incompatible persistence system without a recorded reason.

## 7. Data architecture

### 7.1 Data ownership

The PRD entities are the domain model: Profile, Experience, Education, Skill, Achievement, Certificate, Project, ResearchPaper/Publication, UpcomingResearch, WorkingPaper, Language, eBook, Message, ResumeConfig, PortfolioCategory, navigation/footer/page configuration, MediaAsset, and AdminUser.

Define TypeScript types before creating forms, API contracts, or database schemas. Keep identifiers stable and use explicit status values where the PRD defines them.

### 7.2 Temporary data phase

During Phases 1–4:

- Use a typed temporary data module under `lib/data/`.
- Keep selectors and derived values separate from page markup.
- Mark the data as temporary seed data in code and documentation.
- Do not present temporary data as persistent storage.
- Do not import the nonexistent `src/data/index.ts`.

### 7.3 Persistent data phase

During Phase 5 and later:

- The chosen persistence layer is **Supabase**: Supabase Postgres for data and Supabase Storage for media (S3-compatible), accessed with the **plain Supabase client** (`@supabase/supabase-js` + `@supabase/ssr`). No ORM (Prisma) and no client data cache (TanStack Query) — decided 2026-09-23.
- Clients live in server-only modules under `lib/db/` (marked with `import "server-only"`): a cookie-aware `@supabase/ssr` client for the admin session, and a service-role client for privileged writes that is used only after the session is verified. Never expose the secret key (`sb_secret_…`) to the browser.
- Schema is owned by SQL migrations managed with the Supabase CLI (`supabase/migrations/`); TypeScript types are generated from the schema (`supabase gen types typescript`) into `lib/db/` and used by all selectors and actions.
- Row Level Security is enabled on every table, deny by default. Public content tables get read-only `select` policies; messages, download stats, and admin/config data have no public policies.
- Public reads: Server Components call `lib/data/` selectors. Admin CRUD: Server Actions (session check → zod validation → write → `revalidatePath`/`revalidateTag`). Route Handlers are used only for auth, the contact form, media upload, resume export, and the download counter. Do not implement the same mutation both ways.
- Expose persistence through typed Route Handlers, Server Actions, or server-only data-access functions under `lib/data/` and `lib/storage/`.
- Keep public reads unauthenticated and protected writes authenticated.
- Validate and sanitize all write payloads on the server.
- Store media separately from content records via Supabase Storage and persist only safe metadata and URLs in Postgres.
- Use migrations; the database starts empty apart from the admin user. `lib/data/index.ts` placeholders are never loaded into the database.
- Revalidate public reads (`revalidatePath`/`revalidateTag`) after admin mutations.
- Abstract Supabase access behind typed selectors so page components depend on the data-access layer, not on provider specifics directly.

## 8. Security boundaries

- `/admin/*` is a protected boundary. Unauthenticated visitors must be redirected to `/admin/login`.
- Authentication state and secrets remain server-side. Never expose private environment variables or credentials to client bundles; use `NEXT_PUBLIC_` only for values that are safe to expose.
- Passwords must be hashed, sessions must expire, logout must revoke the session, and repeated login failures must be rate-limited or locked out.
- Treat every Route Handler and Server Action as an untrusted entry point. Authenticate, authorize, validate, and sanitize inside the server boundary.
- Every admin mutation requires authorization and server-side validation.
- Contact submissions require honeypot and rate-limit protection; CAPTCHA is optional.
- File uploads require type, size, and content validation before storage.
- Destructive admin actions require two-step confirmation.
- Public pages should use safe rendering, sanitized rich content, and appropriate HTTP/security headers.
- HTTPS, CSRF/XSS protections, backups, monitoring, and secure headers are launch requirements.

## 9. Rendering and caching

- Use Server Components and `metadata` exports for plain page titles. There is no SEO module (no Open Graph, canonical, sitemap, robots, or structured data), per the owner's 2026-09-23 decision.
- Use `next/image` for local and remote portfolio imagery with meaningful alt text and explicit dimensions or a controlled `fill` layout.
- Use route-level loading, error, and not-found states where data or records can fail.
- Public reads may use documented time-based revalidation or CDN caching. Admin writes must call the appropriate cache invalidation mechanism after a successful mutation.
- Prefer tag-based revalidation for shared content collections and path-based revalidation when a single route is affected.
- Dynamic filters and tabs should use URL search parameters when the state must be refreshable or shareable.
- Keep the public light theme and dark navy hero sections. Keep the admin surface dark and separate.
- The design guide contains Vite and `src/index.css` references inherited from another project. For this repository, use `app/globals.css`, `@theme`/`@theme inline`, and the Next.js App Router conventions.

## 10. Phase alignment

| Phase | Architecture outcome |
| --- | --- |
| Phase 1 | App Router shell, route groups, design tokens, shared primitives, typed temporary data |
| Phase 2 | Public portfolio routes and shared public layout |
| Phase 3 | Research, publication, eBook, and dynamic detail routes |
| Phase 4 | Resume variants, shared resume configuration, and export boundary |
| Phase 5 | Same-app full-stack backend, database, authentication, protected API, admin shell, live public reads |
| Phase 6 | Advanced admin modules, media storage, contact pipeline, and settings |
| Phase 7 | Security, performance, accessibility, deployment, backups, and monitoring |

A phase is complete only when its implementation, acceptance criteria, and definition of done in `docs/phases.md` are verified.

## 11. Open architecture decisions

The following decisions remain open until the relevant phase:

1. Select the database and migration strategy. **Resolved:** Supabase Postgres (hosted), migrated from `lib/data/index.ts` seed data.
2. Select media/object storage and upload boundaries. **Resolved:** Supabase Storage (S3-compatible) buckets accessed through `lib/storage/`.
3. Select the authentication/session mechanism and password policy. **Resolved:** Supabase Auth (email/password + server-side sessions, built-in brute-force protection).
4. Confirm the final brand fonts. **Resolved:** follow `docs/design.md` (DM Serif Display / Plus Jakarta Sans / JetBrains Mono via `next/font/google`).
5. Select the charting library for the dashboard overview charts. **Resolved:** Recharts via shadcn `Chart`; charts use content counts and anonymous `DownloadStat` aggregates only (no visitor tracking).
8. Select the data client and admin data-flow. **Resolved (2026-09-23):** plain Supabase client, Server Actions for admin CRUD, zod validation; Prisma and TanStack Query/Form rejected.
6. Select the resume PDF rendering strategy. **Resolved:** server-side headless Chromium rendering of the resume routes, so the PDF matches the site exactly.
7. Select the transactional email provider. **Resolved:** Resend.
9. Database starting state. **Resolved:** the Supabase database is empty. Migrations create the schema; **no content seed** (revised 2026-09-23: the admin starts empty); an admin seed script creates the single Supabase Auth user via the Admin API from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars (never committed), idempotently.

Record each decision in this file and in `docs/memory.md`.
