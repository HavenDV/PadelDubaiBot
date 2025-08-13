drop policy "Users can update own record" on "public"."users";

revoke delete on table "public"."bookings" from "anon";

revoke insert on table "public"."bookings" from "anon";

revoke references on table "public"."bookings" from "anon";

revoke select on table "public"."bookings" from "anon";

revoke trigger on table "public"."bookings" from "anon";

revoke truncate on table "public"."bookings" from "anon";

revoke update on table "public"."bookings" from "anon";

revoke insert on table "public"."bookings" from "authenticated";

revoke references on table "public"."bookings" from "authenticated";

revoke select on table "public"."bookings" from "authenticated";

revoke trigger on table "public"."bookings" from "authenticated";

revoke truncate on table "public"."bookings" from "authenticated";

revoke update on table "public"."bookings" from "authenticated";

revoke delete on table "public"."registrations" from "anon";

revoke insert on table "public"."registrations" from "anon";

revoke references on table "public"."registrations" from "anon";

revoke select on table "public"."registrations" from "anon";

revoke trigger on table "public"."registrations" from "anon";

revoke truncate on table "public"."registrations" from "anon";

revoke update on table "public"."registrations" from "anon";

revoke delete on table "public"."registrations" from "authenticated";

revoke insert on table "public"."registrations" from "authenticated";

revoke references on table "public"."registrations" from "authenticated";

revoke select on table "public"."registrations" from "authenticated";

revoke trigger on table "public"."registrations" from "authenticated";

revoke truncate on table "public"."registrations" from "authenticated";

revoke update on table "public"."registrations" from "authenticated";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
$function$
;

CREATE OR REPLACE FUNCTION public.is_current_user(target_tg_id bigint)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select ((auth.jwt() -> 'app_metadata' ->> 'tg_id')::bigint = target_tg_id)
$function$
;

grant delete on table "public"."locations" to "authenticated";


  create policy "Only admins can delete bookings"
  on "public"."bookings"
  as permissive
  for delete
  to authenticated
using (( SELECT is_admin() AS is_admin));



  create policy "Only admins can insert bookings"
  on "public"."bookings"
  as permissive
  for insert
  to authenticated
with check (( SELECT is_admin() AS is_admin));



  create policy "Only admins can update bookings"
  on "public"."bookings"
  as permissive
  for update
  to authenticated
using (( SELECT is_admin() AS is_admin))
with check (( SELECT is_admin() AS is_admin));



  create policy "Only admins can delete locations"
  on "public"."locations"
  as permissive
  for delete
  to authenticated
using (( SELECT is_admin() AS is_admin));



  create policy "Only admins can insert locations"
  on "public"."locations"
  as permissive
  for insert
  to authenticated
with check (( SELECT is_admin() AS is_admin));



  create policy "Only admins can update locations"
  on "public"."locations"
  as permissive
  for update
  to authenticated
using (( SELECT is_admin() AS is_admin))
with check (( SELECT is_admin() AS is_admin));



  create policy "Users can update own record"
  on "public"."users"
  as permissive
  for update
  to authenticated
using (( SELECT is_current_user(users.id) AS is_current_user))
with check (( SELECT is_current_user(users.id) AS is_current_user));



