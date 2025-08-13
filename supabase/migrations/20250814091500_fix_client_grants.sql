-- Restore client read privileges required by RLS policies
-- This migration re-grants SELECT where a previous migration revoked them.

-- Locations: allow anon and authenticated to read
grant select on table "public"."locations" to "anon";
grant select on table "public"."locations" to "authenticated";

-- Bookings: allow anon and authenticated to read
grant select on table "public"."bookings" to "anon";
grant select on table "public"."bookings" to "authenticated";

-- Registrations: allow anon and authenticated to read
grant select on table "public"."registrations" to "anon";
grant select on table "public"."registrations" to "authenticated";

-- Users: restrict to safe columns
grant select ("id", "first_name", "last_name", "username", "photo_url", "explicit_name", "created_at", "updated_at", "admin")
  on "public"."users" to "anon";
grant select ("id", "first_name", "last_name", "username", "photo_url", "explicit_name", "created_at", "updated_at", "admin")
  on "public"."users" to "authenticated";

-- Users: allow authenticated to update only explicit_name (user-facing nickname)
grant update ("explicit_name") on "public"."users" to "authenticated";


