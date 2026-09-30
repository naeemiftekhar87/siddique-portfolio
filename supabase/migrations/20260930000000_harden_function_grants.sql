-- Security hardening (2026-09-30 review): the internal trigger function
-- should not be executable by the public API roles. Postgres checks EXECUTE
-- only when a trigger is created, not when it fires, so updated_at keeps
-- working for every write.
revoke execute on function public.set_updated_at() from public, anon, authenticated;
