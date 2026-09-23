# Product Requirements Document (PRD)

## Academic & Professional Portfolio Platform with Admin CMS

|                     |                                                             |
| ------------------- | ----------------------------------------------------------- |
| **Document status** | Draft v1.0                                                  |
| **Date**            | 22 September 2026                                           |
| **Product type**    | Personal branding website + content management system (CMS) |
| **Platform**        | Responsive web (desktop, tablet, mobile)                    |

---

## 1. Overview

### 1.1 Product Summary

A personal website for an academic-professional that presents their career, research, portfolio, certificates, eBooks, and resume in one polished place. It has two parts:

1. **Public Website** – a visitor-facing site (Home, About, Experience, Education, Skills, Achievements, Certificates, Portfolio, Research, Publications, eBooks, Resume Center, Contact).
2. **Admin Panel** – a secure back office where the owner manages every piece of content, the resume/CV output, site appearance, media, and messages without touching code.

### 1.2 Problem Statement

Academics and professionals keep their information scattered across LinkedIn, Google Scholar, ResearchGate, PDFs, and personal files. Updating a CV in multiple formats is slow, and generic website builders don't handle research-specific content (papers, citations, upcoming topics, working papers) well.

### 1.3 Product Vision

A single source of truth: the owner enters data once in the admin panel, and it appears consistently across the website, resume variants (Professional and Infographic).

### 1.4 Goals

- Present a credible, modern professional identity that converts visitors into collaborators, employers, or readers.
- Make research output (papers, metrics, pipeline) highly discoverable.
- Let the owner update all content in minutes with no developer help.
- Generate multiple resume/CV formats from the same data.
- Surface content and inbox metrics (content counts, resume/eBook downloads, unread messages) on the admin dashboard — without behavioural tracking of visitors.

### 1.5 Non-Goals (v1)

- Multi-user / multi-tenant hosting (single owner only).
- E-commerce checkout for eBooks. All eBooks are free: the owner uploads a PDF and visitors read it on the site (and can download it).
- Multi-language content (English only).
- Blogging/newsletter platform.
- Native mobile apps.
- Automatic import, scraping, or sync of content from LinkedIn, Google Scholar, ResearchGate, ORCID, or any other external source. All content, including Scholar metrics, is entered manually by the owner through the admin panel.

---

## 2. Users & Personas

| Persona                              | Description                                 | Key Needs                                                           |
| ------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------- |
| **Site Owner (Admin)**               | The academic/professional who owns the site | Fast content updates, resume generation, message inbox              |
| **Recruiter / Hiring Manager**       | Evaluates the owner's fit for a role        | Quick view of experience, skills, certificates, downloadable resume |
| **Researcher / Collaborator**        | Looks for research alignment                | Publications, DOI links, interests, upcoming topics, contact        |
| **Academic Committee / Institution** | Reviews credentials                         | Education, achievements, verified certificates, resume              |
| **Reader / Student**                 | Interested in eBooks and knowledge          | Book catalog, details, download                                     |

---

## 3. Success Metrics

| Metric                                            | Target (first 6 months)                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| Lighthouse Performance / Accessibility            | ≥ 90 each                                                          |
| Resume downloads / month                          | Counted anonymously (no visitor tracking), growth month over month |
| Contact form submissions / month                  | Counted from Messages, growth month over month                     |
| Time for owner to publish a new paper/certificate | < 3 minutes                                                        |

---

## 4. Scope Summary

| Area              | Pages / Modules                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Public site       | 20 routes (incl. detail pages and 404)                                                                                     |
| Shared components | Navbar, Footer                                                                                                             |
| Admin panel       | Login, Dashboard, ~28 management screens                                                                                   |
| Data              | Profile, experience, education, skills, certificates, projects, research papers, languages, eBooks, achievements, messages |

---

## 5. Functional Requirements – Public Website

Priority legend: **P0** = must have for launch, **P1** = should have, **P2** = nice to have.

### 5.1 Global Design System

- **P0** Dark navy hero pattern reused across all inner pages (title, subtitle, contextual stats).
- **P0** Consistent card, badge, chip, and button styles; status badges (Published, Under Review, Draft, etc.) with colour coding.
- **P0** Fully responsive layout; mobile-first.
- **P1** Smooth scroll, hover, and expand/collapse animations; respect `prefers-reduced-motion`.
- **P0** Accessibility: WCAG 2.1 AA (contrast, keyboard navigation, ARIA on accordions/tabs, alt text).

### 5.2 Navbar (fixed)

- **P0** Deep navy glassmorphism background: semi-transparent at top, opaque after scroll.
- **P0** Brand wordmark (the owner's name from Profile, in the display font; there is no logo) and 7 links: Home, About, Certificates, Portfolio, Research, eBooks, Contact.
- **P0** Active link shown as glass pill.
- **P0** Social icons (Google Scholar, LinkedIn, GitHub) with cyan hover.
- **P0** Mobile hamburger with dark glass dropdown.
- **P1** Links order/visibility driven by the Navigation Editor in admin.

### 5.3 Footer

- **P0** Dark navy (design.md `navy` token, `#040d1f`) 4-column layout: Brand + social + CTA; Explore links; Research links; Resume & Profile links.
- **P0** Stats strip with 6 metrics.
- **P0** Copyright bar.
- **P1** Tagline, copyright text, social URLs, and quick links driven by Footer Editor.

### 5.4 Home (`/`)

- **P0** Hero: profile photo, name, headline, location, badge, 6 animated stat counters.
- **P0** Professional Background cards (Experience, Education, Skills, Achievements) each linking to their full page.
- **P0** Featured sections: Research, Portfolio, Certificates (3-column grid).
- **P0** Recent Experience teaser (2 most recent roles).
- **P0** Recent Research strip (3 latest papers with status badges).
- **P0** CTA band: "Open to Collaboration" with _Get in Touch_ and _Explore Research_ buttons.
- **P1** Each section can be shown/hidden from admin (5 section toggles).

### 5.5 About (`/about`)

- **P0** Dark hero: photo, name, headline, location, social icons, 6-stat grid.
- **P0** Sections: Professional Summary, Career Focus narrative, Academic Journey (education cards), Current Role snapshot.
- **P0** Sidebar: Research Interests tag cloud, At-a-Glance stats, Domain Expertise chips, Resume & CV card (_View Resume Center_ + _Download PDF_), Quick Nav grid.

### 5.6 Experience (`/experience`)

- **P0** Hero stats: years, companies, roles, countries.
- **P0** Expandable accordion per role: responsibilities, achievements, skill tags, company logo.
- **P1** Expand/collapse all control.

### 5.7 Education (`/education`)

- **P0** Hero stats: degrees, GPA, years, countries.
- **P0** Cards with degree, major, GPA, coursework, status badge (Completed / In Progress).

### 5.8 Skills (`/skills`)

- **P0** Hero stats.
- **P0** Search bar and category tabs: All / Industry Knowledge / Tools & Technologies / Interpersonal / Other.
- **P0** Skill cards with proficiency level bar.
- **P1** Empty-state message when search returns nothing.

### 5.9 Achievements (`/achievements`)

- **P0** Hero with 4 stats: total, categories, time span, institutions.
- **P0** Featured/pinned most-recent achievement card (amber gradient).
- **P0** Cards grouped by category: Academic, Research, Professional, Competition, Community.
- **P1** Alternating timeline strip at bottom with category-coloured dots.

### 5.10 Certificates (`/certificates`, `/certificates/:id`)

- **P0** Hero stats: total, verified, categories, issuing bodies.
- **P0** Sticky filter bar: All / Professional / Academic.
- **P0** Cards: image, issuer, grade, duration, credential ID, skill chips, verified badge.
- **P0** Detail page: title, issuer, description, skills list, credential ID, completion date, grade, duration, back navigation.
- **P1** "Verify credential" external link when a URL is provided.

### 5.11 Portfolio (`/portfolio`, `/portfolio/:id`)

- **P0** Hero stats: projects, categories, tools, status.
- **P0** Category filter tabs (categories managed in admin).
- **P0** Project cards: image, tech-stack chips, status badge, hover overlay with _View_ and external _Link_.
- **P0** Detail page: title, category, Problem / Objective / Methodology / Results, tools chips, back navigation.

### 5.12 Research (`/research`)

Combined page with a 3-section toggle.

- **P0** Hero with 4 Scholar stats: citations, h-index, i10-index, publications.
- **P0** Toggle: **Research Interests / Published Research / Upcoming Topics**.
- **P0** _Research Interests_: interest area cards grid + Google Scholar metrics CTA panel.
- **P0** _Published Research_: merged, de-duplicated papers list; search + status filter; DOI copy button; detail link.
- **P0** _Upcoming Topics_: expandable cards (research question, contribution, methodology, keywords); area filter; collaboration CTA.
- **P0** Deep-linkable section state (e.g. `?tab=published`).

### 5.13 Research Detail (`/research/:id`)

- **P0** Hero: title, status badge, journal.
- **P0** Full abstract, keyword chips, DOI, authors, year, back navigation.
- **P1** "Cite this paper" (copy BibTeX/APA).

### 5.14 Publications (`/publications`)

- **P0** Hero with Scholar metrics strip.
- **P0** Search + status filter.
- **P0** Cards: abstract, keywords, DOI copy, external link.

### 5.15 Upcoming Research (`/research/upcoming`)

- **P0** Standalone page for pipeline topics (backward-compatible URL; content shared with Research → Upcoming Topics).

### 5.16 eBooks (`/ebooks`, `/ebooks/:id`)

- **P0** Hero stats: titles, pages, categories, downloads.
- **P0** Filterable grid: cover, category, page count, description.
- **P0** Detail page: title, subtitle, author, description, ISBN, pages, year, category, _Download/Get_ button, back navigation.
- **P0** eBook content is a PDF uploaded by the owner (Supabase Storage). The detail page shows it in an in-site PDF viewer (_Read online_), with a _Download_ button; downloads are counted anonymously (`DownloadStat`).
- **P2** Payment integration (future phase; not planned).

### 5.17 Resume Center (`/resume`)

- **P0** Hero with _Download PDF_ and _Infographic View_ buttons.
- **P0** Professional Resume (the only document variant; the Academic and Research CVs were removed on 2026-09-23). A link/button leads to the Infographic Resume.
- **P0** White-paper resume document with gradient navy header.
- **P0** Sections: Summary, Experience, Education, Technical Skills, Certifications, Languages (flag, name, level, progress bar).
- **P0** PDF export that is exactly what the site shows: the server renders the same resume route in headless Chromium (A4 print CSS) and returns the PDF, so on-screen and PDF output share one source.
- **P1** Sections, counts, accent colour, and font are controlled by the admin Resume Editor.

### 5.18 Infographic Resume (`/resume/infographic`)

- **P0** Dark hero with back link and _Download PDF_.
- **P0** A4-style layout: profile, stats, skill bars, experience timeline, education, research.

### 5.19 Contact (`/contact`)

- **P0** Dark hero with social links.
- **P0** Form: name, email, subject, message; validation; success state.
- **P0** Contact info sidebar: location, email, social links.
- **P0** Submissions saved to Admin → Messages.
- **P0** Spam protection (honeypot + rate limit; CAPTCHA optional).
- **P1** Email notification to owner on new message.

### 5.20 404 Not Found (`/*`)

- **P0** Dark hero with search icon, current path in code tag, _Go Home_ and _Go Back_ buttons, quick-links grid to 6 main pages.

---

## 6. Functional Requirements – Admin Panel

### 6.1 Authentication & Security

- **P0** Login (`/admin/login`) with email + password.
- **P0** All `/admin/*` routes protected; redirect to login when unauthenticated.
- **P0** Session expiry, logout, secure password hashing, brute-force lockout.
- **P0** Destructive actions require confirmation (two-step delete).

### 6.2 Dashboard (`/admin`)

- **P0** 9 stat cards: Experience, Degrees, Skills, Certificates, Projects, Research Papers, Publications, eBooks, Unread Messages.
- **P0** Overview charts on the dashboard (Recharts), built only from content and anonymous counters: a bar chart of content items per section (experience, certificates, projects, papers, eBooks, and so on) and an area chart of resume/eBook downloads over time. No page-view or visitor data.
- **P0** Recent Activity feed (5 items with type icons).
- **P0** Quick Actions panel (6 shortcut links).

### 6.3 Content Management Modules

| Route                              | Module                    | Requirements                                                                                                              |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/admin/profile`                   | Personal Information      | Photo, name, badge, headline, summary, location, email; hero stats editor; research-interest tag manager; Scholar metrics |
| `/admin/experience`                | Experience                | CRUD; responsibilities list; achievements list; skill tags; company logo                                                  |
| `/admin/education`                 | Education                 | CRUD; degree, major, GPA, coursework, status                                                                              |
| `/admin/skills`                    | Skills                    | CRUD; name, category, proficiency slider                                                                                  |
| `/admin/achievements`              | Achievements              | CRUD; category filter tabs; colour-coded badges; inline edit; two-step delete                                             |
| `/admin/certificates/professional` | Professional Certificates | CRUD; image URL, grade, duration, credential ID, skill chips                                                              |
| `/admin/certificates/academic`     | Academic Certificates     | Same as above, separate category                                                                                          |
| `/admin/certificates/training`     | Training Certificates     | Same as above, separate category (added 2026-09-23 from the owner's design source)                                        |
| `/admin/certificates/awards`       | Awards                    | Same as above, separate category (added 2026-09-23 from the owner's design source)                                        |
| `/admin/projects`                  | Projects                  | CRUD; image, tech stack, status, problem/objective/methodology/results                                                    |
| `/admin/publications`              | Publications              | CRUD; title, journal, year, area, status, abstract, keywords, DOI                                                         |
| `/admin/research/papers`           | Research Papers           | CRUD; same fields as publications                                                                                         |
| `/admin/research/profile`          | Research Profile          | Scholar metrics (citations, h-index, i10-index, publications); research bio; profile links (Scholar, ORCID, ResearchGate) |
| `/admin/research/interests`        | Research Interests        | Tag manager (add via Enter/button, remove with ×); live preview                                                           |
| `/admin/research/upcoming`         | Upcoming Research         | CRUD; title, area, status, expected year, research question, contribution, methodology, keywords; expandable cards        |
| `/admin/research/working`          | Working Papers            | CRUD; version, target journal, submission date, preprint URL; status pipeline (Draft → Accepted)                          |
| `/admin/ebooks`                    | eBooks                    | CRUD; cover image, **PDF file upload**, category, pages, ISBN, description                                                |
| `/admin/messages`                  | Messages                  | Read/unread list, mark-read, reply, delete with confirmation                                                              |

### 6.4 Resume Management

| Route                        | Requirements                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/admin/resume/professional` | Section toggles, experience/skills count sliders, accent-colour picker, font selector, custom note, live white-paper preview |
| `/admin/resume/infographic`  | Same editor, infographic context                                                                                             |

### 6.5 Portfolio Management

- **`/admin/portfolio/gallery`** – image grid, category filter, hover-reveal delete/link, inline add form with image URL preview.
- **`/admin/portfolio/categories`** – sortable list, 8-swatch colour picker, slug auto-generation, project count.

### 6.6 Website Management

- **`/admin/website/home`** – hero badge, headline, sub-headline, summary, CTA labels/links, profile image URL, visibility toggles for 5 sections.
- **`/admin/website/about`** – photo URL, identity fields, 3 bio textareas with character count, domain expertise (comma list with live chip preview).
- **`/admin/website/navigation`** – drag-to-reorder links, show/hide eye toggle, hidden pages list, add custom link, live navbar preview.
- **`/admin/website/footer`** – tagline, copyright, social URLs, quick-links manager, live dark-navy footer preview.

### 6.7 Media Library (`/admin/media`)

- **P0** Upload zone; grid/list toggle; search; type filter (images/documents); copy URL; delete with confirmation.
- **P1** Image optimisation (resize, WebP), file size/type limits.

### 6.8 Settings (`/admin/settings`)

- **P0** Social & academic profile links (LinkedIn, GitHub, Google Scholar).
- **P0** Password change with show/hide.
- Personal information is edited only on `/admin/profile` (not repeated in Settings). There are no notification preferences (contact-message emails are always sent) and no danger zone (2026-09-23).

---

## 7. Data Model (Entities)

| Entity                                  | Key Fields                                                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Profile**                             | photo, name, badge, headline, summary, location, email, hero stats[], interests[], social links, scholar metrics               |
| **Experience**                          | id, company, logo, role, location, country, start/end date, responsibilities[], achievements[], skills[]                       |
| **Education**                           | id, institution, degree, major, GPA, start/end, coursework[], status, country                                                  |
| **Skill**                               | id, name, category, level (0–100)                                                                                              |
| **Achievement**                         | id, title, description, category, date, institution, pinned                                                                    |
| **Certificate**                         | id, title, issuer, category (professional/academic), image, grade, duration, credentialId, date, skills[], verified, verifyUrl |
| **Project**                             | id, title, category, image, techStack[], status, problem, objective, methodology, results, tools[], link                       |
| **ResearchPaper / Publication**         | id, title, authors[], journal, year, area, status, abstract, keywords[], DOI, url                                              |
| **UpcomingResearch**                    | id, title, area, status, expectedYear, researchQuestion, contribution, methodology, keywords[]                                 |
| **WorkingPaper**                        | id, title, version, targetJournal, submissionDate, preprintUrl, status                                                         |
| **Language**                            | id, name, flag, level, proficiency %                                                                                           |
| **eBook**                               | id, title, subtitle, author, cover, category, pages, year, ISBN, description, fileUrl (uploaded PDF), downloads                |
| **Message**                             | id, name, email, subject, body, createdAt, read, repliedAt                                                                     |
| **ResumeConfig**                        | type (professional / infographic), sections visibility, counts, accent colour, font, custom note                               |
| **PortfolioCategory**                   | id, name, slug, colour, order                                                                                                  |
| **NavItem / FooterConfig / PageConfig** | label, path, visible, order; tagline, copyright, links; home/about editable fields                                             |
| **MediaAsset**                          | id, url, type, size, uploadedAt                                                                                                |
| **AdminUser**                           | Supabase Auth user (email; password hashed by Supabase) ; seeded by an admin seed script (no notification prefs)               |
| **DownloadStat**                        | date, kind (resume variant / eBook), targetId, count — daily aggregate only; no IP, cookie, user-agent, or visitor identifier  |

**Supabase decision:** The Phase 5 backend uses **Supabase** as the single platform for data (Postgres), media storage (S3-compatible object storage), and authentication (email/password + server-side sessions). The typed seed data at `lib/data/index.ts` — to be created in Phase 1; it does not exist yet; **clearly marked placeholder content** for building the UI, since real content is entered by the owner through the admin — (seed data: 1 profile, 6 experiences, 2 education entries, 38 skills, 15 certificates, 4 projects, 6 research papers, 4 languages, 5 eBooks, 12 achievements, 6 messages) is a UI-only placeholder for Phases 1–4 and is **not** loaded into Supabase; the database starts empty. Mixing Supabase with any other persistence system is disallowed unless a separate decision record is written.

---

## 8. Non-Functional Requirements

| Category            | Requirement                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Performance**     | LCP < 2.5 s on 4G; route-level code splitting; lazy-loaded images; optimised assets                                              |
| **Accessibility**   | WCAG 2.1 AA; keyboard-friendly accordions, tabs, drag-reorder alternatives                                                       |
| **Security**        | HTTPS, CSRF/XSS protection, input validation and sanitisation, rate limiting, secure file upload validation, role-protected APIs |
| **Privacy**         | GDPR-friendly; contact data stored securely; no behavioural tracking of visitors                                                 |
| **Reliability**     | 99.9% uptime target; automated backups of content and media                                                                      |
| **Browser support** | Latest two versions of Chrome, Edge, Safari, Firefox; iOS Safari and Android Chrome                                              |
| **Maintainability** | Typed codebase (TypeScript), reusable components, documented API, CI/CD                                                          |
| **Scalability**     | Handle traffic spikes (e.g. paper going viral) via CDN and caching                                                               |

---

## 9. Technical Approach (Recommended)

| Layer              | Recommendation                                                                                                                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | Next.js 16 App Router + React 19 + TypeScript, Tailwind CSS v4 design tokens, shadcn/ui, Recharts for dashboard charts                                                                                                                                         |
| **Rendering**      | Next.js full-stack app: Server Components (SSR/ISR) for public pages; no Vite, React Router, or separate backend                                                                                                                                               |
| **Backend/API**    | Plain Supabase client (`@supabase/supabase-js` + `@supabase/ssr`) in server-only `lib/db/`; Server Components for reads, Server Actions for admin CRUD, Route Handlers for auth/contact/media/resume export; zod validation. No ORM (Prisma) or TanStack Query |
| **Database**       | Supabase Postgres (hosted) for content; Supabase Storage (S3-compatible) for media                                                                                                                                                                             |
| **Auth**           | Supabase Auth: email/password + server-side sessions, brute-force protection                                                                                                                                                                                   |
| **Media storage**  | Supabase Storage (object storage) for images, covers, documents                                                                                                                                                                                                |
| **PDF generation** | Headless Chromium renders the resume route server-side (`app/api/resume/export`) so the PDF matches the site exactly                                                                                                                                           |
| **Email**          | Resend (owner notifications for new contact messages; replies)                                                                                                                                                                                                 |
| **Hosting**        | Vercel (Next.js serverless/Node runtime + CDN); Supabase for DB/storage/auth; custom domain registered at Namecheap                                                                                                                                            |

---

## 10. What to Build – Phased Roadmap

### Phase 1 – Foundation (Weeks 1–2)

- Project setup, routing, design system (tokens, hero, cards, chips, badges, buttons).
- Navbar, Footer, 404 page.
- Typed data models and seed data.

### Phase 2 – Core Public Pages (Weeks 3–5)

- Home, About, Experience, Education, Skills, Achievements.
- Certificates (+ detail), Portfolio (+ detail).
- Contact page UI.

### Phase 3 – Research & Publishing (Weeks 6–7)

- Research combined page (3-section toggle), Research Detail, Publications, Upcoming Research.
- eBooks list and detail.

### Phase 4 – Resume System (Weeks 8–9)

- Resume Center (Professional Resume), Infographic Resume, PDF export.

### Phase 5 – Backend & Admin Core (Weeks 10–13)

- Database, API, authentication, media storage.
- Admin login, dashboard, layout shell.
- CRUD modules: profile, experience, education, skills, achievements, certificates, projects, publications, research papers, eBooks.
- Public site switched from static data to live API.

### Phase 6 – Advanced Admin (Weeks 14–16)

- Research profile, interests, upcoming, working papers.
- Messages inbox (contact form wired end-to-end, email notifications).
- Resume editors (2: professional, infographic), portfolio gallery/categories.
- Website editors (home, about, navigation, footer).
- Media Library, Settings.

### Phase 7 – Hardening & Launch (Weeks 17–18)

- Accessibility audit, performance tuning, security review.
- Cross-browser/device QA, content migration.
- Production deployment, backups, monitoring.

### Future (Post-launch)

- Payments for eBooks, blog/news section, multi-language site, newsletter, testimonials, Google Scholar auto-sync, ORCID import, dark/light theme toggle.

---

## 11. Acceptance Criteria (Key Examples)

| Feature             | Acceptance Criteria                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Content persistence | Editing an item in admin updates the public page within one page refresh (or within the cache TTL)                                  |
| Contact form        | A valid submission shows a success state, appears in Admin → Messages as unread, and triggers a notification email                  |
| Certificate filter  | Selecting "Academic" shows only academic certificates; count matches                                                                |
| Research toggle     | Switching sections doesn't reload the page; URL reflects the active section                                                         |
| Resume PDF          | Downloaded PDF visually matches the on-screen resume and respects admin section toggles and accent colour                           |
| Navigation editor   | Reordering or hiding a link updates the public navbar and the footer links where applicable                                         |
| Auth                | Visiting `/admin` while logged out redirects to `/admin/login`; wrong password shows an error and locks out after repeated failures |
| Delete              | Any delete asks for confirmation and can't be triggered by a single accidental click                                                |
| Responsive          | All pages usable at 360 px width with no horizontal scrolling                                                                       |

---

## 12. Risks & Mitigations

| Risk                                       | Impact               | Mitigation                                                                    |
| ------------------------------------------ | -------------------- | ----------------------------------------------------------------------------- |
| Static data only (no persistence)          | Admin edits are lost | Prioritise backend in Phase 5; use existing data as seed                      |
| PDF fidelity issues across resume variants | Inconsistent output  | Server-side rendering with a single print stylesheet; visual regression tests |
| Spam in contact form                       | Inbox noise          | Honeypot, rate limiting, optional CAPTCHA                                     |
| Large media uploads                        | Slow site, cost      | Size limits, automatic image optimisation, CDN                                |
| Scope creep (28+ admin screens)            | Delays               | Strict phased delivery; reuse a generic CRUD component                        |

---

## 13. Assumptions & Open Questions

**Assumptions**

- Single owner/admin; no public user accounts.
- Content is primarily in English.
- All content, including Google Scholar metrics, is entered manually by the owner through the admin panel; nothing is fetched automatically.
- The database (including production) **starts empty**: only the admin user is seeded. The admin panel shows only what the owner adds; `lib/data/index.ts` placeholders exist solely to build the public UI before Phase 5 and are never loaded into the database (revised 2026-09-23).
- Owner's external profiles (link targets only, never fetched; GitHub URL to be provided by the owner): LinkedIn `https://www.linkedin.com/in/mdtarakesiddique`, Google Scholar `https://scholar.google.com/citations?user=ohf_wZIAAAAJ&hl=en`, ResearchGate `https://www.researchgate.net/profile/Md-Siddique-50`.

**Open Questions**

1. The owner's GitHub URL (the owner will create and provide it).
2. The exact domain name (registered at Namecheap) and the personal address that should receive contact notifications.

**Resolved Decisions**

- The product is a full-stack **Next.js 16 App Router** application (SSR for public pages, Route Handlers/Server Actions for the backend) in a single repository — not a static SPA.
- **eBooks:** free, no payments; owner uploads a PDF that is read on the site and downloadable. **No multi-language** (English only).
- **Branding:** no logo; the owner's name is the wordmark. Colours and fonts follow `docs/design.md`.
- **Resume PDF:** server-side headless-Chromium rendering of the resume routes so the PDF matches the site exactly.
- **Email:** Resend (contact notifications and replies), sending from the owner's Namecheap domain once its DNS records are verified. The domain has no mailbox; notifications go to the owner's personal address, with Reply-To set to the visitor.
- **Hosting:** Vercel, with the Namecheap custom domain pointed at it.
- **Database:** the Supabase database is empty; the schema is created from migrations, and only the single admin user is seeded (no sample content).
- **No SEO module** (owner decision, 2026-09-23): no `/admin/seo`, no `SEOEntry`, no per-page meta/OG/canonical editing, no `sitemap.xml`/`robots.txt`/JSON-LD, no SEO Lighthouse target. Pages keep plain `<title>`s, and the admin stays `noindex`.
- There is **no analytics module**: no `/admin/analytics`, no `/api/analytics`, no visitor/page-view tracking. The dashboard shows content/message metrics plus anonymous daily download counts (`DownloadStat`). The "top pages" chart is replaced by a content-per-section chart; time-on-site and bounce-rate metrics are dropped. A cookieless hosted analytics tool (e.g. Plausible, Umami, Vercel Web Analytics) is not adopted and would need owner approval.
- **Data layer:** plain Supabase client — no Prisma, no TanStack Query/Form (the Kilo plan was rejected on 2026-09-23). Schema changes are SQL migrations via the Supabase CLI with generated TypeScript types; RLS is enabled on every table.
- The Phase 5 backend uses **Supabase** for data (Postgres), media storage (S3-compatible object storage), and authentication (email/password + server-side sessions). The typed seed data at `lib/data/index.ts` (created in Phase 1) is the migration source; no separate S3-compatible service or self-hosted database is in scope. Mixing Supabase with an incompatible persistence system requires a documented decision record.

---

## 14. Appendix – Sitemap

**Public**
`/`, `/about`, `/experience`, `/education`, `/skills`, `/achievements`, `/certificates`, `/certificates/:id`, `/portfolio`, `/portfolio/:id`, `/research`, `/research/:id`, `/research/upcoming`, `/publications`, `/ebooks`, `/ebooks/:id`, `/resume`, `/resume/infographic`, `/contact`, `/*` (404)

**Admin**
`/admin/login`, `/admin`, `/admin/profile`, `/admin/experience`, `/admin/education`, `/admin/skills`, `/admin/achievements`, `/admin/certificates/professional`, `/admin/certificates/academic`, `/admin/certificates/training`, `/admin/certificates/awards`, `/admin/projects`, `/admin/publications`, `/admin/research/papers`, `/admin/research/profile`, `/admin/research/interests`, `/admin/research/upcoming`, `/admin/research/working`, `/admin/ebooks`, `/admin/messages`, `/admin/resume/professional`, `/admin/resume/infographic`, `/admin/portfolio/gallery`, `/admin/portfolio/categories`, `/admin/website/home`, `/admin/website/about`, `/admin/website/navigation`, `/admin/website/footer`, `/admin/media`, `/admin/settings`
