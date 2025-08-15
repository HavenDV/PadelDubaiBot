alter table "public"."bookings" alter column "price" set data type integer using "price"::integer;

alter table "public"."bookings" add constraint "bookings_price_check" CHECK ((price >= 0)) not valid;

alter table "public"."bookings" validate constraint "bookings_price_check";


