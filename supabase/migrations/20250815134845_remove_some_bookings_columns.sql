alter table "public"."bookings" drop constraint "bookings_chat_message_unique";

alter table "public"."bookings" drop constraint "bookings_max_players_check";

drop index if exists "public"."bookings_chat_message_unique";

alter table "public"."bookings" drop column "chat_id";

alter table "public"."bookings" drop column "max_players";

alter table "public"."bookings" drop column "message_id";

alter table "public"."bookings" drop column "title";


