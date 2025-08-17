alter table "public"."users" drop constraint "users_skill_level_check";

alter table "public"."users" add constraint "users_skill_level_check" CHECK ((skill_level = ANY (ARRAY['E'::text, 'D-'::text, 'D'::text, 'D+'::text, 'D++'::text, 'C-'::text, 'C'::text, 'C+'::text]))) not valid;

alter table "public"."users" validate constraint "users_skill_level_check";


