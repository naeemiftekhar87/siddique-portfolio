-- Initial schema for the portfolio CMS (Phase 5).
--
-- Every table has RLS enabled and is deny-by-default. Public content tables
-- get a read-only SELECT policy for anon/authenticated; all writes go through
-- server code that verifies the admin session and then uses the secret key
-- (which bypasses RLS). download_stats, rate_limits and media_assets have no
-- public policy at all. The database starts empty (docs/memory.md decision 9).

-- ─── Helpers ────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Content collections ───────────────────────────────────────────────────

create table public.experiences (
  id bigint generated always as identity primary key,
  company text not null,
  position text not null,
  type text not null default '',
  start_date text not null default '',
  end_date text not null default '',
  location text not null default '',
  description text not null default '',
  responsibilities text[] not null default '{}',
  achievements text[] not null default '{}',
  skills text[] not null default '{}',
  logo text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education (
  id bigint generated always as identity primary key,
  university text not null,
  degree text not null,
  major text not null default '',
  start_date text not null default '',
  end_date text not null default '',
  status text not null default 'In Progress',
  gpa text not null default '',
  description text not null default '',
  coursework text[] not null default '{}',
  skills text[] not null default '{}',
  logo text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  level integer not null check (level between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.achievements (
  id bigint generated always as identity primary key,
  title text not null,
  organization text not null default '',
  date text not null default '',
  description text not null default '',
  category text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certificates (
  id bigint generated always as identity primary key,
  title text not null,
  issuer text not null,
  category text not null,
  completion_date text not null default '',
  grade text not null default '',
  duration text not null default '',
  credential_id text not null default '',
  skills text[] not null default '{}',
  description text not null default '',
  image text not null default '',
  verified boolean not null default false,
  verify_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  color text not null default 'blue',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  category_id bigint references public.portfolio_categories (id) on delete set null,
  short_description text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  tools text[] not null default '{}',
  image text not null default '',
  problem text not null default '',
  objective text not null default '',
  methodology text not null default '',
  results text not null default '',
  status text not null default 'Completed',
  link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_category_id_idx on public.projects (category_id);

create table public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  image_url text not null,
  caption text not null default '',
  category text not null,
  project_link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.research_papers (
  id bigint generated always as identity primary key,
  title text not null,
  authors text[] not null default '{}',
  journal text not null default '',
  year integer,
  area text not null default '',
  status text not null check (
    status in ('Working Paper', 'Submitted', 'Under Review', 'Revision Requested', 'Accepted', 'Published')
  ),
  abstract text not null default '',
  keywords text[] not null default '{}',
  doi text not null default '',
  url text not null default '',
  pdf_url text not null default '',
  version text not null default '',
  submission_date date,
  preprint_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.upcoming_research (
  id bigint generated always as identity primary key,
  title text not null,
  area text not null default '',
  status text not null default 'Idea',
  expected_year text not null default '',
  question text not null default '',
  contribution text not null default '',
  methodology text not null default '',
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.languages (
  id bigint generated always as identity primary key,
  name text not null,
  flag text not null default '',
  level text not null default '',
  proficiency integer not null default 0 check (proficiency between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ebooks (
  id bigint generated always as identity primary key,
  title text not null,
  subtitle text not null default '',
  author text not null default '',
  cover text not null default '',
  category text not null default '',
  pages integer not null default 0 check (pages >= 0),
  year integer,
  isbn text not null default '',
  description text not null default '',
  file_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Singletons (profile, links, website/resume configs) ───────────────────
-- One row per key; the value shape is validated by zod in lib/data/settings.ts.

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ─── Media library (admin only) ─────────────────────────────────────────────

create table public.media_assets (
  id bigint generated always as identity primary key,
  bucket text not null,
  path text not null,
  url text not null,
  name text not null,
  type text not null check (type in ('image', 'document')),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- ─── Anonymous download counter (no IP, cookie, or visitor id) ─────────────

create table public.download_stats (
  day date not null default current_date,
  kind text not null check (kind in ('resume-professional', 'resume-infographic', 'ebook')),
  target_id text not null default '',
  count integer not null default 0 check (count >= 0),
  primary key (day, kind, target_id)
);

create or replace function public.increment_download(p_kind text, p_target_id text default '')
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.download_stats (day, kind, target_id, count)
  values (current_date, p_kind, coalesce(p_target_id, ''), 1)
  on conflict (day, kind, target_id)
  do update set count = public.download_stats.count + 1;
$$;

-- ─── Rate limits (login, contact form) ──────────────────────────────────────
-- key is a salted hash of the limited subject, never a raw IP address.

create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

-- Atomically count one hit in a fixed window; returns the count in the
-- current window (the caller compares it with its limit).
create or replace function public.hit_rate_limit(p_key text, p_window_seconds integer)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_count integer;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case
          when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
          else r.count + 1
        end,
        window_start = case
          when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
          else r.window_start
        end
  returning count into current_count;
  return current_count;
end;
$$;

-- Only the server (secret key) may call the counter functions.
revoke all on function public.increment_download(text, text) from public, anon, authenticated;
revoke all on function public.hit_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.increment_download(text, text) to service_role;
grant execute on function public.hit_rate_limit(text, integer) to service_role;

-- ─── updated_at triggers ─────────────────────────────────────────────────────

do $$
declare
  t text;
begin
  foreach t in array array[
    'experiences', 'education', 'skills', 'achievements', 'certificates',
    'portfolio_categories', 'projects', 'gallery_items', 'research_papers',
    'upcoming_research', 'languages', 'ebooks', 'site_settings'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ─── Row Level Security ─────────────────────────────────────────────────────

do $$
declare
  t text;
begin
  -- Public, read-only content.
  foreach t in array array[
    'experiences', 'education', 'skills', 'achievements', 'certificates',
    'portfolio_categories', 'projects', 'gallery_items', 'research_papers',
    'upcoming_research', 'languages', 'ebooks', 'site_settings'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "Public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;

  -- Server-only tables: RLS on, no policies.
  foreach t in array array['media_assets', 'download_stats', 'rate_limits']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- ─── Storage buckets ─────────────────────────────────────────────────────────
-- Public read (files are shown on the public site); uploads go through the
-- authenticated /api/media route with the secret key, so no storage policies
-- for anon/authenticated writes are created.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('images', 'images', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('documents', 'documents', true, 52428800,
    array['application/pdf'])
on conflict (id) do nothing;
