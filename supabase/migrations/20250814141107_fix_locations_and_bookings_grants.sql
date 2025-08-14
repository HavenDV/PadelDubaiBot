-- Ensure client roles have the necessary table privileges to work with RLS policies

-- Locations: allow read to anon/authenticated and writes to authenticated (admin enforced by RLS)
grant select on table "public"."locations" to "anon";
grant select on table "public"."locations" to "authenticated";
grant insert ("name", "url") on table "public"."locations" to "authenticated";
grant update ("name", "url") on table "public"."locations" to "authenticated";
grant delete on table "public"."locations" to "authenticated";

-- Bookings: allow read to anon/authenticated and writes to authenticated (admin enforced by RLS)
grant select on table "public"."bookings" to "anon";
grant select on table "public"."bookings" to "authenticated";
grant insert ("title", "start_time", "end_time", "location_id", "price", "courts", "max_players", "note", "cancelled", "chat_id", "message_id") on table "public"."bookings" to "authenticated";
grant update ("title", "start_time", "end_time", "location_id", "price", "courts", "max_players", "note", "cancelled", "chat_id", "message_id") on table "public"."bookings" to "authenticated";
grant delete on table "public"."bookings" to "authenticated";

-- Registrations: allow read to anon/authenticated and writes to authenticated (per-user enforced by RLS)
grant select on table "public"."registrations" to "anon";
grant select on table "public"."registrations" to "authenticated";
grant insert ("booking_id", "user_id") on table "public"."registrations" to "authenticated";
grant update on table "public"."registrations" to "authenticated";
grant delete on table "public"."registrations" to "authenticated";

