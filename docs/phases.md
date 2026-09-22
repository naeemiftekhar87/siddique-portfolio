# Phase-Wise Build Tracker

## Academic & Professional Portfolio Platform

**How to use:** Work top to bottom. Tick `[x]` as you finish each task. A phase is complete only when every task **and** its "Definition of Done" are ticked. Update the progress table after each phase.

---

## Progress Overview

| Phase | Name                 | Tasks | Done | Status         |
| ----- | -------------------- | ----- | ---- | -------------- |
| 1     | Foundation           | 22    | 0    | ⬜ Not started |
| 2     | Core Public Pages    | 40    | 0    | ⬜ Not started |
| 3     | Research & eBooks    | 32    | 0    | ⬜ Not started |
| 4     | Resume System        | 20    | 0    | ⬜ Not started |
| 5     | Backend & Admin Core | 47    | 0    | ⬜ Not started |
| 6     | Advanced Admin       | 48    | 0    | ⬜ Not started |
| 7     | Hardening & Launch   | 26    | 0    | ⬜ Not started |

**Status legend:** ⬜ Not started · 🟨 In progress · ✅ Complete

---

## Phase 1 — Foundation

**Goal:** A running app with routing, design system, shared layout, and typed seed data.
**Estimated time:** 2 weeks

### 1.1 Project Setup

- [ ] Initialise project (Next.js + React + TypeScript)
- [ ] Configure Tailwind CSS (or design tokens) and fonts
- [ ] Set up ESLint and folder structure (`components/`, `app/`, `lib/`, `public/`)
- [ ] Set up Git repo, branching strategy, and `.env` handling
- [ ] Define all public route placeholders with the App Router

### 1.2 Design System

- [ ] Define colour tokens (navy `#0a1628`, cyan, amber, category colours)
- [ ] Build reusable **Hero** component (dark hero with title, subtitle, stats slot)
- [ ] Build **Card**, **Badge** (status colours), **Chip/Tag**, **Button** variants
- [ ] Build **Stat counter** component (animated)
- [ ] Build **Accordion**, **Tabs**, **Search input**, **Filter bar** components
- [ ] Build **SectionHeading** and **CTA band** components

### 1.3 Layout Components

- [ ] **Navbar:** glassmorphism (transparent → opaque on scroll), logo, 7 links, active pill
- [ ] Navbar: social icons (Scholar, LinkedIn, GitHub) with cyan hover
- [ ] Navbar: mobile hamburger + dark glass dropdown
- [ ] **Footer:** 4-column layout (Brand, Explore, Research, Resume & Profile)
- [ ] Footer: 6-metric stats strip and copyright bar
- [ ] **404 page:** hero, path in code tag, Go Home / Go Back, 6 quick links
- [ ] Scroll-to-top on route change

### 1.4 Data Layer

- [ ] Define TypeScript types for all entities (Profile, Experience, Education, Skill, Certificate, Project, Paper, Language, eBook, Achievement, Message)
- [ ] Create `lib/data/index.ts` with seed data (1 profile, 6 experiences, 2 education, 38 skills, 15 certificates, 4 projects, 6 papers, 4 languages, 5 eBooks, 12 achievements, 6 messages)
- [ ] Create helper selectors (recent experience, latest papers, stats calculators)

**✅ Definition of Done**

- [ ] All routes render a placeholder page without errors
- [ ] Navbar and Footer work on desktop and mobile
- [ ] Design system components are reusable and documented (demo page)

---

## Phase 2 — Core Public Pages

**Goal:** All profile-related public pages complete with static data.
**Estimated time:** 3 weeks

### 2.1 Home (`/`)

- [ ] Hero: photo, name, headline, location, badge
- [ ] 6 animated stat counters
- [ ] Professional Background cards (Experience, Education, Skills, Achievements) with links
- [ ] Featured grid (Research, Portfolio, Certificates)
- [ ] Recent Experience teaser (2 latest roles)
- [ ] Recent Research strip (3 papers + status badges)
- [ ] "Open to Collaboration" CTA band with 2 buttons

### 2.2 About (`/about`)

- [ ] Dark hero with photo, social links, 6-stat grid
- [ ] Professional Summary and Career Focus sections
- [ ] Academic Journey with education cards
- [ ] Current Role snapshot
- [ ] Sidebar: Research Interests tag cloud
- [ ] Sidebar: At-a-Glance stats + Domain Expertise chips
- [ ] Sidebar: Resume & CV card + Quick Nav grid

### 2.3 Experience (`/experience`)

- [ ] Hero with stats (years, companies, roles, countries)
- [ ] Accordion role cards: responsibilities, achievements, skill tags, logo
- [ ] Expand/collapse all control

### 2.4 Education (`/education`)

- [ ] Hero with stats (degrees, GPA, years, countries)
- [ ] Education cards: degree, major, GPA, coursework, status badge

### 2.5 Skills (`/skills`)

- [ ] Hero with stats
- [ ] Search bar
- [ ] Category tabs (All / Industry Knowledge / Tools & Technologies / Interpersonal / Other)
- [ ] Skill cards with proficiency bars
- [ ] Empty-state for no results

### 2.6 Achievements (`/achievements`)

- [ ] Hero with 4 stats
- [ ] Featured amber gradient card (most recent)
- [ ] Category-grouped cards (Academic, Research, Professional, Competition, Community)
- [ ] Alternating timeline strip with coloured dots

### 2.7 Certificates (`/certificates`, `/certificates/[id]`)

- [ ] Hero with stats (total, verified, categories, issuers)
- [ ] Sticky filter bar (All / Professional / Academic)
- [ ] Certificate cards (image, issuer, grade, duration, credential ID, skill chips, verified badge)
- [ ] Detail page: description, skills, credential ID, date, grade, duration
- [ ] Detail page: back navigation and "not found" handling

### 2.6 Portfolio (`/portfolio`, `/portfolio/[id]`)

- [ ] Hero with stats
- [ ] Category filter tabs
- [ ] Project cards with tech chips, status badge, hover overlay (View + Link)
- [ ] Detail page: Problem / Objective / Methodology / Results
- [ ] Detail page: tools chips and back navigation

### 2.8 Contact (`/contact`) — UI only

- [ ] Hero with social links
- [ ] Form: name, email, subject, message
- [ ] Client-side validation and success state
- [ ] Contact info sidebar (location, email, socials)

**✅ Definition of Done**

- [ ] Every page matches the spec and is responsive at 360 px
- [ ] Filters, tabs, search, and accordions work
- [ ] No console errors; all internal links resolve

---

## Phase 3 — Research & eBooks

**Goal:** The research-focused area and eBook catalog complete.
**Estimated time:** 2 weeks

### 3.1 Research Page (`/research`)

- [ ] Hero with 4 Scholar stats (citations, h-index, i10-index, publications)
- [ ] 3-section toggle (Interests / Published / Upcoming) with URL state (`?tab=`)
- [ ] **Interests:** interest area cards grid
- [ ] **Interests:** Google Scholar metrics CTA panel
- [ ] **Published:** merged, de-duplicated papers list
- [ ] **Published:** search + status filter
- [ ] **Published:** DOI copy button (with "copied" feedback) and detail link
- [ ] **Upcoming:** expandable cards (question, contribution, methodology, keywords)
- [ ] **Upcoming:** area filter and collaboration CTA

### 3.2 Research Detail (`/research/[id]`)

- [ ] Hero: title, status badge, journal
- [ ] Abstract, keyword chips, DOI, authors, year
- [ ] Back navigation
- [ ] "Cite this paper" (copy APA/BibTeX) — _P1_

### 3.3 Publications (`/publications`)

- [ ] Hero with Scholar metrics strip
- [ ] Search + status filter
- [ ] Cards: abstract, keywords, DOI copy, external link

### 3.4 Upcoming Research (`/research/upcoming`)

- [ ] Standalone page reusing Upcoming Topics component
- [ ] Verify backward-compatible URL works

### 3.5 eBooks (`/ebooks`, `/ebooks/[id]`)

- [ ] Hero with stats (titles, pages, categories, downloads)
- [ ] Filterable grid: cover, category, pages, price, description
- [ ] Detail page: title, subtitle, author, description, ISBN, pages, year, category
- [ ] Download/Get button (placeholder link)
- [ ] Back navigation

**✅ Definition of Done**

- [ ] Toggle state survives refresh and is shareable via URL
- [ ] Paper lists show no duplicates
- [ ] All detail pages handle invalid IDs gracefully

---

## Phase 4 — Resume System

**Goal:** Three resume variants, an infographic version, and PDF export.
**Estimated time:** 2 weeks

### 4.1 Resume Center (`/resume`)

- [ ] Dark hero with _Download PDF_ and _Infographic View_ buttons
- [ ] Sticky tab bar (Professional / Academic CV / Research CV)
- [ ] White-paper document with gradient navy header
- [ ] Sections: Summary, Experience, Education, Technical Skills, Certifications
- [ ] Languages section (flag, name, level, progress bar)
- [ ] Research & Publications section (Academic + Research CV only)
- [ ] Resume config object (section toggles, counts, accent colour, font) driving render

### 4.2 Infographic Resume (`/resume/infographic`)

- [ ] Hero with back link + _Download PDF_
- [ ] A4 layout: profile, stats, skill bars
- [ ] Experience timeline, education, research blocks

### 4.3 PDF Export

- [ ] Print stylesheet (A4, margins, page breaks)
- [ ] Download PDF for each of the 4 variants
- [ ] Test fonts, colours, and multi-page overflow

**✅ Definition of Done**

- [ ] PDF matches the on-screen layout for all 4 variants
- [ ] Section toggles in config visibly change output
- [ ] No content cut off across page breaks

---

## Phase 5 — Backend & Admin Core

**Goal:** Real database, API, authentication, and core CRUD. Public site reads live data.
**Estimated time:** 4 weeks

### 5.1 Backend Setup

- [ ] Configure the Supabase platform stack (Postgres, Storage, Auth); install `@supabase/supabase-js` and set up server-only client in `lib/db/`
- [ ] Design database schema for all entities (see PRD §7) in Supabase Postgres
- [ ] Create migrations and a seed script from `lib/data/index.ts`
- [ ] Configure Supabase Storage buckets for images and documents
- [ ] Build Route Handlers and Server Actions (public reads, protected writes)
- [ ] Add validation, error handling, and logging

### 5.2 Authentication

- [ ] Configure Supabase Auth admin user with email/password
- [ ] Login endpoint + server-side session handling (Supabase Auth sessions via cookies)
- [ ] Login page (`/admin/login`) with error states
- [ ] Protected route wrapper (redirect to login)
- [ ] Logout and session expiry
- [ ] Brute-force lockout / rate limiting (provided by Supabase Auth)

### 5.3 Admin Shell

- [ ] Admin layout: sidebar navigation (grouped), top bar, responsive
- [ ] Reusable generic **CRUD table/form** components
- [ ] Reusable confirm-delete (two-step) dialog
- [ ] Toast notifications for success/error
- [ ] Loading and empty states

### 5.4 Dashboard (`/admin`)

- [ ] 9 stat cards wired to real content/message counts (Visitors removed — no analytics)
- [ ] Dashboard overview charts: bar chart (top pages) and area chart (downloads)
- [ ] Recent Activity feed (5 items with icons)
- [ ] Quick Actions panel (6 links)

### 5.5 Core CRUD Modules

- [ ] `/admin/profile` — photo, name, badge, headline, summary, location, email
- [ ] `/admin/profile` — hero stats editor, interests tag manager, Scholar metrics
- [ ] `/admin/experience` — CRUD + responsibilities/achievements/skills lists
- [ ] `/admin/education` — CRUD
- [ ] `/admin/skills` — CRUD with proficiency slider
- [ ] `/admin/achievements` — CRUD, category tabs, inline edit, two-step delete
- [ ] `/admin/certificates/professional` — CRUD
- [ ] `/admin/certificates/academic` — CRUD
- [ ] `/admin/projects` — CRUD with problem/objective/methodology/results
- [ ] `/admin/publications` — CRUD
- [ ] `/admin/research/papers` — CRUD
- [ ] `/admin/ebooks` — CRUD with cover upload

### 5.6 Connect Public Site to API

- [ ] Replace static data imports with same-app API/data-access calls (loading + error states)
- [ ] Add route-level caching and CDN headers
- [ ] Verify each public page shows live admin edits

**✅ Definition of Done**

- [ ] Add/edit/delete in admin reflects on the public site
- [ ] Unauthenticated users cannot reach admin or write APIs
- [ ] Seed data fully migrated with nothing lost

---

## Phase 6 — Advanced Admin

**Goal:** All remaining admin modules, contact pipeline, and site-wide controls.
**Estimated time:** 3 weeks

### 6.1 Research Management

- [ ] `/admin/research/profile` — Scholar metrics, bio, profile links (Scholar, ORCID, ResearchGate)
- [ ] `/admin/research/interests` — tag manager (Enter/button add, × remove) + live preview
- [ ] `/admin/research/upcoming` — CRUD + expandable cards
- [ ] `/admin/research/working` — CRUD, version, target journal, preprint URL, status pipeline (Draft → Accepted)

### 6.2 Messages & Contact Pipeline

- [ ] Contact form POST endpoint storing to database
- [ ] Spam protection (honeypot + rate limit; optional CAPTCHA)
- [ ] `/admin/messages` — read/unread list, mark-read
- [ ] Reply action (mailto or email send)
- [ ] Delete with confirmation
- [ ] Email notification to owner on new message
- [ ] Unread count in dashboard and sidebar badge

### 6.3 Resume Editors

- [ ] `/admin/resume/professional` — section toggles, count sliders, accent colour, font, custom note
- [ ] Live white-paper preview
- [ ] `/admin/resume/academic`
- [ ] `/admin/resume/research`
- [ ] `/admin/resume/infographic`
- [ ] Persist configs and connect to public Resume Center

### 6.4 Portfolio Management

- [ ] `/admin/portfolio/gallery` — image grid, category filter, hover delete/link, inline add with URL preview
- [ ] `/admin/portfolio/categories` — sortable list, 8-swatch colour picker, slug auto-generation, project count
- [ ] Connect categories to public Portfolio filter tabs

### 6.5 Website Editors

- [ ] `/admin/website/home` — hero text, CTAs, profile image, 5 section visibility toggles
- [ ] `/admin/website/about` — photo, identity, 3 bio textareas with char count, domain expertise chips
- [ ] `/admin/website/navigation` — drag-to-reorder, show/hide toggle, hidden list, add custom link, live preview
- [ ] `/admin/website/footer` — tagline, copyright, social URLs, quick links manager, live preview
- [ ] Public Navbar/Footer/Home/About read from these configs

### 6.6 SEO

- [ ] `/admin/seo` — per-page title, description, keywords, OG image, canonical, noindex toggle
- [ ] Inject meta tags into public pages
- [ ] Generate `sitemap.xml` and `robots.txt`
- [ ] Add JSON-LD structured data (Person, ScholarlyArticle, Book) — _P1_

### 6.7 Media Library

- [ ] Upload zone with type/size validation
- [ ] Grid/list toggle, search, type filter
- [ ] Copy URL, delete with confirmation
- [ ] Image optimisation (resize/WebP) — _P1_
- [ ] Media picker used inside other admin forms

### 6.8 Settings

- [ ] Profile quick-edit
- [ ] 4 notification toggles
- [ ] Password change with show/hide
- [ ] Danger zone with double confirmation

**✅ Definition of Done**

- [ ] Every route in the admin sitemap is reachable and functional
- [ ] A contact submission travels form → database → inbox → email
- [ ] Changing nav/footer/home settings updates the live site

---

## Phase 7 — Hardening & Launch

**Goal:** A secure, fast, accessible, monitored production release.
**Estimated time:** 2 weeks

### 7.1 Quality Assurance

- [ ] Manual test pass for every public page and admin module
- [ ] Automated tests for critical flows (login, CRUD, contact form, filters)
- [ ] Cross-browser test (Chrome, Edge, Safari, Firefox)
- [ ] Device test (iOS Safari, Android Chrome, tablet)
- [ ] Fix all P0/P1 bugs

### 7.2 Performance

- [ ] Lighthouse ≥ 90 (Performance, Accessibility, SEO) on key pages
- [ ] Route-level code splitting and lazy-loaded images
- [ ] CDN and caching configured
- [ ] LCP under 2.5 s on 4G

### 7.3 Accessibility

- [ ] Keyboard navigation for tabs, accordions, menus, dialogs
- [ ] Colour contrast audit (AA)
- [ ] Alt text and ARIA labels reviewed
- [ ] Alternative to drag-to-reorder (up/down buttons)

### 7.4 Security

- [ ] HTTPS enforced
- [ ] Input validation and sanitisation on all endpoints
- [ ] CSRF/XSS protections, secure headers
- [ ] File upload validation
- [ ] Optional: two-factor authentication (TOTP)

### 7.5 Content & SEO

- [ ] Replace seed data with real content
- [ ] Fill SEO metadata for every page
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Open Graph previews

### 7.6 Deployment

- [ ] Production hosting, domain, and SSL
- [ ] CI/CD pipeline
- [ ] Automated backups (database + media)
- [ ] Error monitoring and uptime alerts
- [ ] Launch checklist sign-off

**✅ Definition of Done**

- [ ] Site live on custom domain with monitoring
- [ ] Owner can update all content without a developer
- [ ] Backup restore tested once

---

## Post-Launch Backlog (Future Ideas)

- [ ] eBook payments
- [ ] Blog / news section
- [ ] Multi-language support
- [ ] Newsletter signup
- [ ] Testimonials
- [ ] Google Scholar auto-sync / ORCID import
- [ ] Light/dark theme toggle

---

## Weekly Log (Optional)

| Week | Phase | Completed | Blockers | Next |
| ---- | ----- | --------- | -------- | ---- |
| 1    |       |           |          |      |
| 2    |       |           |          |      |
| 3    |       |           |          |      |
