-- Add pin state columns to messages table
alter table "public"."messages" add column if not exists "is_pinned" boolean default false;
alter table "public"."messages" add column if not exists "pinned_at" timestamp with time zone;

-- Ensure select grants include new columns (redundant if using SELECT ON TABLE)
grant select (is_pinned, pinned_at) on table public.messages to anon, authenticated;

