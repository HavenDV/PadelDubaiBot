CREATE TABLE IF NOT EXISTS public.users (
    -- Telegram user data
    id bigint NOT NULL,  -- Telegram user ID
    first_name text NOT NULL,   -- Telegram user first name
    last_name text, -- Telegram user last name
    username text, -- Telegram user username
    photo_url text, -- Telegram user photo URL
    language_code text, -- Telegram user language code
    is_premium boolean, -- Telegram user is premium
    allows_write_to_pm boolean, -- Telegram user allows write to PM
    is_bot boolean DEFAULT false, -- Telegram user is bot

    -- App data
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    explicit_name text,
    skill_level text CHECK (skill_level IN ('E','D','D+','C-','C','C+')),

    -- Admin data
    admin boolean DEFAULT false
);

COMMENT ON TABLE public.users IS 'Main users table storing Telegram user information for the Telegram mini app.';

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Helper to check admin flag from JWT app_metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
set search_path = ''
stable
AS $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
$$;

-- Helper: is the given Telegram user id equal to current JWT user id
CREATE OR REPLACE FUNCTION public.is_current_user(target_tg_id bigint)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
set search_path = ''
stable
AS $$
  select ((auth.jwt() -> 'app_metadata' ->> 'tg_id')::bigint = target_tg_id)
$$;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Column-level security: restrict column access for client roles
-- Revoke broad access first to avoid unintended exposure
REVOKE ALL ON TABLE public.users FROM PUBLIC, anon, authenticated;

-- Ensure backend has full access
GRANT ALL ON TABLE public.users TO service_role;

-- Allow clients to read ONLY the explicit_name column
GRANT SELECT (explicit_name) ON public.users TO anon, authenticated;

-- Allow clients to update ONLY the explicit_name column (combined with RLS policy below)
GRANT UPDATE (explicit_name) ON public.users TO authenticated;

-- Create policies
CREATE POLICY "Public users are viewable by everyone" 
ON public.users FOR SELECT 
TO authenticated, anon
USING (true);

CREATE POLICY "Users can update own record"
ON public.users FOR UPDATE
TO authenticated
USING ((select public.is_current_user(id)))
WITH CHECK ((select public.is_current_user(id)));

-- Trigger to keep updated_at current on row modification
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY invoker
set search_path = ''
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();