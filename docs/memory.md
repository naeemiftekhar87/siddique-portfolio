# Project Memory

## Current State

A minimal Next.js 16.3.5 (App Router) + React 19.2.8 + TypeScript + Tailwind CSS v4 scaffold exists under `app/`. The repo has `app/page.tsx`, `app/layout.tsx`, and `app/globals.css`. There is no `src/` directory, no `components/`, no `lib/`, no backend, database, auth, or test framework.

## Key Decisions

### Supabase for Data, Media Storage, and Authentication

**Decision (Phase 5):** The full-stack backend uses **Supabase** as the single external platform for:
- **Database:** Supabase Postgres (hosted) — the source of truth for all PRD entities (Profile, Experience, Education, Skill, Achievement, Certificate, Project, ResearchPaper/Publication, UpcomingResearch, WorkingPaper, Language, eBook, Message, ResumeConfig, navigation/footer/page config, SEOEntry, MediaAsset, AdminUser).
- **Storage:** Supabase Storage (S3-compatible object storage, backed by Postgres with a storage schema) — the source of truth for all media uploads (profile photos, certificate images, project images, eBook covers, uploaded documents).
- **Authentication:** Supabase Auth (email + password, server-side sessions via cookies, brute-force protection built-in) — the source of truth for the single-owner admin login/session lifecycle.

This resolves the Phase 5 open architecture decisions (database, media/object storage, authentication) documented in `docs/architecture.md` §11 items 1–3 and `docs/PRD.md` §13 question 4.

**Integration approach:**
- The server-only client lives in `lib/db/supabase.ts` (admin/server-side client using `createClient` from `@supabase/supabase-js` with service-role key restricted to server-only modules under `lib/`).
- The Next.js application remains the single repository; Route Handlers under `app/api/` are thin wrappers that authenticate via server-side session, validate, call typed `lib/data/` selectors, and return typed responses. No separate backend repository.
- Public pages read through same-app server-only data-access functions (`lib/data/`) that query Supabase; admin writes go through protected Route Handlers / Server Actions with cache revalidation.
- Media uploads go through protected `app/api/media/route.ts` which uploads to Supabase Storage and persists only the safe metadata URL in Postgres.

**Not adopted:** A separate Express/Vite backend, separate API repository, Firestore, S3/Cloudflare R2 as a standalone service, or self-hosted Postgres. Mixing Supabase Postgres with any other persistence system is disallowed unless a separate decision record is written.

### No Analytics module

**Decision (Phase 5):** There is no analytics feature. The dedicated `/admin/analytics` page, the `/api/analytics` route, the `lib/analytics/` event-tracking layer, behavioral visitor/page-view tracking, the pie chart (referrers), date-range filter, and CSV export are all removed. The `AnalyticsEvent` entity is dropped from the data model and the PRD sitemap.

The dashboard (`/admin`) keeps only content/message metrics: 9 stat cards (Experience, Degrees, Skills, Certificates, Projects, Research Papers, Publications, eBooks, Unread Messages — "Visitors" removed). As lightweight content-metric overview widgets (not a tracking system), the dashboard renders a bar chart (top pages) and an area chart (downloads); the charting library remains **Recharts** for these widgets. The PRD Privacy requirement is reframed to "no behavioural tracking of visitors."

## Completed Work

- Repository scaffold confirmed: Next.js 16.3.5, React 19.2.8, TypeScript 5, Tailwind CSS v4, ESLint 9, `next/font/google` with Geist/Geist Mono.
- `docs/PRD.md`, `docs/phases.md`, `docs/architecture.md`, `docs/design.md` created as the canonical guides.
- Architecture decisions for Supabase data/media/auth recorded.
- Analytics module removed (no `/admin/analytics`, no `/api/analytics`, no `lib/analytics/`, no tracking); dashboard reduced to 9 content/message stat cards plus lightweight top-pages/downloads overview charts.

## Pending Work

See `docs/phases.md` for the ordered build tracker. Phase 1 (Foundation) has not yet started implementation. The static seed-data scaffold is still the temporary Phase 1–4 data layer; the Supabase-backed persistence target is Phase 5.

## Retained Decisions

- Single-owner, single-admin; no public user accounts.
- Content is primarily in English.
- Google Scholar metrics are entered manually in v1.
- Public site uses the light theme with dark navy heroes; admin uses a separate dark theme (see `docs/design.md`).
- Route groups (`(public)`, `(admin)`) are organizational only and do not change the PRD URLs.
- Do not introduce `src/` or a second routing system.

## Blockers

None at this time.
