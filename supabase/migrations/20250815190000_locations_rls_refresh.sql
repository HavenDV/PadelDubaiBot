-- Refresh RLS policies for public.locations after schema changes
set check_function_bodies = off;

-- Ensure RLS is enabled
alter table public.locations enable row level security;

-- (Re)create helper function (noop if already present)
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
$$;

-- Drop existing policies to avoid duplicates
drop policy if exists "Public locations are viewable by everyone" on public.locations;
drop policy if exists "Only admins can insert locations" on public.locations;
drop policy if exists "Only admins can update locations" on public.locations;
drop policy if exists "Only admins can delete locations" on public.locations;

-- Public read access (anon + authenticated)
create policy "Public locations are viewable by everyone"
on public.locations for select
to authenticated, anon
using (true);

-- Admin-only writes
create policy "Only admins can insert locations"
on public.locations for insert
to authenticated
with check ((select public.is_admin()));

create policy "Only admins can update locations"
on public.locations for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Only admins can delete locations"
on public.locations for delete
to authenticated
using ((select public.is_admin()));

-- Column grants for new fields (idempotent)
grant select (
  id, name, url,
  address, phone, website, plus_code,
  rating, user_ratings_total, opening_hours, attributes,
  place_id, lat, lng,
  created_at, updated_at
) on public.locations to anon, authenticated;

grant insert (
  name, url,
  address, phone, website, plus_code,
  rating, user_ratings_total, opening_hours, attributes,
  place_id, lat, lng
) on public.locations to authenticated;

grant update (
  name, url,
  address, phone, website, plus_code,
  rating, user_ratings_total, opening_hours, attributes,
  place_id, lat, lng
) on public.locations to authenticated;

