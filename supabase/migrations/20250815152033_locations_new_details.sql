alter table "public"."locations" add column "address" text;

alter table "public"."locations" add column "attributes" jsonb;

alter table "public"."locations" add column "lat" double precision;

alter table "public"."locations" add column "lng" double precision;

alter table "public"."locations" add column "opening_hours" jsonb;

alter table "public"."locations" add column "phone" text;

alter table "public"."locations" add column "place_id" text;

alter table "public"."locations" add column "plus_code" text;

alter table "public"."locations" add column "rating" double precision;

alter table "public"."locations" add column "user_ratings_total" integer;

alter table "public"."locations" add column "website" text;


