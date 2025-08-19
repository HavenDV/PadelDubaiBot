alter table "public"."chats" add column "accent_color_id" integer;

alter table "public"."chats" add column "accepted_gift_types" jsonb;

alter table "public"."chats" add column "active_usernames" text[];

alter table "public"."chats" add column "available_reactions" jsonb;

alter table "public"."chats" add column "background_custom_emoji_id" text;

alter table "public"."chats" add column "bio" text;

alter table "public"."chats" add column "birthdate" jsonb;

alter table "public"."chats" add column "business_intro" jsonb;

alter table "public"."chats" add column "business_location" jsonb;

alter table "public"."chats" add column "business_opening_hours" jsonb;

alter table "public"."chats" add column "can_send_paid_media" boolean;

alter table "public"."chats" add column "can_set_sticker_set" boolean;

alter table "public"."chats" add column "custom_emoji_sticker_set_name" text;

alter table "public"."chats" add column "emoji_status_custom_emoji_id" text;

alter table "public"."chats" add column "emoji_status_expiration_date" bigint;

alter table "public"."chats" add column "first_name" text;

alter table "public"."chats" add column "has_aggressive_anti_spam_enabled" boolean;

alter table "public"."chats" add column "has_hidden_members" boolean;

alter table "public"."chats" add column "has_private_forwards" boolean;

alter table "public"."chats" add column "has_protected_content" boolean;

alter table "public"."chats" add column "has_restricted_voice_and_video_messages" boolean;

alter table "public"."chats" add column "has_visible_history" boolean;

alter table "public"."chats" add column "invite_link" text;

alter table "public"."chats" add column "is_direct_messages" boolean;

alter table "public"."chats" add column "is_forum" boolean;

alter table "public"."chats" add column "join_by_request" boolean;

alter table "public"."chats" add column "join_to_send_messages" boolean;

alter table "public"."chats" add column "last_name" text;

alter table "public"."chats" add column "linked_chat_id" bigint;

alter table "public"."chats" add column "location" jsonb;

alter table "public"."chats" add column "max_reaction_count" integer;

alter table "public"."chats" add column "message_auto_delete_time" integer;

alter table "public"."chats" add column "parent_chat" jsonb;

alter table "public"."chats" add column "personal_chat" jsonb;

alter table "public"."chats" add column "photo" jsonb;

alter table "public"."chats" add column "pinned_message_id" bigint;

alter table "public"."chats" add column "profile_accent_color_id" integer;

alter table "public"."chats" add column "profile_background_custom_emoji_id" text;

alter table "public"."chats" add column "slow_mode_delay" integer;

alter table "public"."chats" add column "sticker_set_name" text;

alter table "public"."chats" add column "unrestrict_boost_count" integer;

CREATE INDEX chats_active_usernames_idx ON public.chats USING gin (active_usernames) WHERE (active_usernames IS NOT NULL);

CREATE INDEX chats_is_direct_messages_idx ON public.chats USING btree (is_direct_messages) WHERE (is_direct_messages = true);

CREATE INDEX chats_is_forum_idx ON public.chats USING btree (is_forum) WHERE (is_forum = true);

CREATE INDEX chats_linked_chat_id_idx ON public.chats USING btree (linked_chat_id) WHERE (linked_chat_id IS NOT NULL);


