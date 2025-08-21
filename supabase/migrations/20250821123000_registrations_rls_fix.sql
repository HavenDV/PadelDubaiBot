-- Align registrations RLS with Telegram-based auth and add admin overrides
-- Uses helpers public.is_current_user(bigint) and public.is_admin() already defined

-- Ensure table exists and RLS is enabled
alter table if exists public.registrations enable row level security;

-- Drop old policies if present
do $$ begin
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'registrations' and policyname = 'Users manage own registrations') then
    drop policy "Users manage own registrations" on public.registrations;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'registrations' and policyname = 'Users update own registrations') then
    drop policy "Users update own registrations" on public.registrations;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'registrations' and policyname = 'Users delete own registrations') then
    drop policy "Users delete own registrations" on public.registrations;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'registrations' and policyname = 'Admins manage registrations (insert)') then
    drop policy "Admins manage registrations (insert)" on public.registrations;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'registrations' and policyname = 'Admins manage registrations (update)') then
    drop policy "Admins manage registrations (update)" on public.registrations;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'registrations' and policyname = 'Admins manage registrations (delete)') then
    drop policy "Admins manage registrations (delete)" on public.registrations;
  end if;
end $$;

-- Recreate user-scoped policies using app_metadata.tg_id via helper
create policy "Users manage own registrations"
on public.registrations
as permissive
for insert
to authenticated
with check ((select public.is_current_user(user_id)));

create policy "Users update own registrations"
on public.registrations
as permissive
for update
to authenticated
using ((select public.is_current_user(user_id)))
with check ((select public.is_current_user(user_id)));

create policy "Users delete own registrations"
on public.registrations
as permissive
for delete
to authenticated
using ((select public.is_current_user(user_id)));

-- Admin overrides
create policy "Admins manage registrations (insert)"
on public.registrations
as permissive
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admins manage registrations (update)"
on public.registrations
as permissive
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins manage registrations (delete)"
on public.registrations
as permissive
for delete
to authenticated
using ((select public.is_admin()));

