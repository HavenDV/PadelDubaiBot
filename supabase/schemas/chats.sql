-- Telegram chats table using chat_id as primary key
CREATE TABLE IF NOT EXISTS public.chats (
    "id" bigint PRIMARY KEY, -- Telegram chat ID as primary key
    "name" text, -- Chat name (from Telegram API)
    "type" text NOT NULL DEFAULT 'group', -- 'group', 'supergroup', 'channel', etc.
    "title" text, -- Chat title from Telegram
    "description" text, -- Chat description from Telegram
    "username" text, -- Chat username if available
    "member_count" integer, -- Number of members (from Telegram API)
    "permissions" jsonb, -- Chat permissions from Telegram API
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX chats_type_idx ON public.chats(type);
CREATE INDEX chats_username_idx ON public.chats(username) WHERE username IS NOT NULL;

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