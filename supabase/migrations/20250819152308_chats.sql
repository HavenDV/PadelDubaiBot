
  create table "public"."chats" (
    "id" bigint not null,
    "name" text,
    "type" text not null default 'group'::text,
    "title" text,
    "description" text,
    "username" text,
    "member_count" integer,
    "permissions" jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."chats" enable row level security;

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE INDEX chats_type_idx ON public.chats USING btree (type);

CREATE INDEX chats_username_idx ON public.chats USING btree (username) WHERE (username IS NOT NULL);

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";


  create policy "Users can view active chats"
  on "public"."chats"
  as permissive
  for select
  to public
using ((auth.uid() IS NOT NULL));


CREATE TRIGGER set_chats_updated_at BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE FUNCTION set_updated_at();


