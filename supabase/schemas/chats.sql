-- Enhanced Telegram chats table with comprehensive Chat/ChatFullInfo fields
CREATE TABLE IF NOT EXISTS public.chats (
    -- Core identification fields (always present)
    "id" bigint PRIMARY KEY, -- Telegram chat ID as primary key
    "type" text NOT NULL DEFAULT 'group', -- 'private', 'group', 'supergroup', or 'channel'
    
    -- Basic chat information
    "title" text, -- Title for supergroups, channels and group chats
    "username" text, -- Username for private chats, supergroups and channels if available
    "first_name" text, -- First name of the other party in a private chat
    "last_name" text, -- Last name of the other party in a private chat
    "name" text, -- Computed name for private chats (first_name + last_name) or custom name
    "description" text, -- Description for groups, supergroups and channels
    "bio" text, -- Bio of the other party in private chat
    
    -- Forum and special chat features
    "is_forum" boolean, -- True if supergroup chat is a forum (has topics enabled)
    "is_direct_messages" boolean, -- True if chat is the direct messages chat of a channel
    
    -- Visual and customization
    "accent_color_id" integer, -- Identifier of accent color for chat name and backgrounds
    "profile_accent_color_id" integer, -- Identifier of accent color for chat's profile background
    "background_custom_emoji_id" text, -- Custom emoji for reply header and link preview background
    "profile_background_custom_emoji_id" text, -- Custom emoji for profile background
    "emoji_status_custom_emoji_id" text, -- Custom emoji status identifier
    "emoji_status_expiration_date" bigint, -- Unix timestamp when emoji status expires
    "max_reaction_count" integer, -- Maximum reactions per message
    
    -- Chat photo information (stored as JSONB)
    "photo" jsonb, -- Chat photo object with file IDs and unique IDs
    
    -- Multiple usernames and contact info
    "active_usernames" text[], -- Array of all active usernames
    "invite_link" text, -- Primary invite link for groups, supergroups and channels
    
    -- Business account features (for private chats)
    "birthdate" jsonb, -- Date of birth object for private chats
    "business_intro" jsonb, -- Business intro object
    "business_location" jsonb, -- Business location object
    "business_opening_hours" jsonb, -- Business opening hours object
    "personal_chat" jsonb, -- Personal channel reference
    
    -- Chat behavior and restrictions
    "available_reactions" jsonb, -- List of available reaction types
    "has_private_forwards" boolean, -- Privacy setting for tg://user links
    "has_restricted_voice_and_video_messages" boolean, -- Voice/video message restrictions
    "join_to_send_messages" boolean, -- Users must join before sending messages
    "join_by_request" boolean, -- Users need approval to join
    "has_protected_content" boolean, -- Messages can't be forwarded
    "has_visible_history" boolean, -- New members can see old messages
    "has_aggressive_anti_spam_enabled" boolean, -- Anti-spam checks enabled
    "has_hidden_members" boolean, -- Non-admins can only see bots and admins
    
    -- Permissions and moderation
    "permissions" jsonb, -- Default chat member permissions
    "slow_mode_delay" integer, -- Minimum delay between messages in seconds
    "unrestrict_boost_count" integer, -- Boosts needed to ignore slow mode
    "message_auto_delete_time" integer, -- Auto-delete time in seconds
    
    -- Gift and payment features
    "accepted_gift_types" jsonb, -- Types of gifts accepted
    "can_send_paid_media" boolean, -- Can send paid media (channels only)
    
    -- Stickers and custom content
    "sticker_set_name" text, -- Group sticker set name
    "can_set_sticker_set" boolean, -- Bot can change sticker set
    "custom_emoji_sticker_set_name" text, -- Custom emoji sticker set name
    
    -- Related chats and location
    "linked_chat_id" bigint, -- Discussion group for channels or vice versa
    "parent_chat" jsonb, -- Parent channel for direct messages
    "location" jsonb, -- Location object for supergroups
    
    -- Pinned message (stored as message ID reference)
    "pinned_message_id" bigint, -- ID of most recent pinned message
    
    -- Legacy/additional metadata
    "member_count" integer, -- Number of members (may not always be available)
    
    -- System timestamps
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX chats_type_idx ON public.chats(type);
CREATE INDEX chats_username_idx ON public.chats(username) WHERE username IS NOT NULL;
CREATE INDEX chats_active_usernames_idx ON public.chats USING GIN(active_usernames) WHERE active_usernames IS NOT NULL;
CREATE INDEX chats_is_forum_idx ON public.chats(is_forum) WHERE is_forum = true;
CREATE INDEX chats_is_direct_messages_idx ON public.chats(is_direct_messages) WHERE is_direct_messages = true;
CREATE INDEX chats_linked_chat_id_idx ON public.chats(linked_chat_id) WHERE linked_chat_id IS NOT NULL;

-- RLS (Row Level Security)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view active chats
CREATE POLICY "Users can view active chats" ON public.chats
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Grants
GRANT ALL ON TABLE public.chats TO postgres;
GRANT ALL ON TABLE public.chats TO service_role;
GRANT SELECT ON TABLE public.chats TO authenticated;
GRANT ALL ON TABLE public.chats TO authenticated; -- Admins will be filtered by RLS

CREATE TRIGGER set_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();