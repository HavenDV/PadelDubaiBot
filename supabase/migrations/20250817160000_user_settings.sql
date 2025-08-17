-- Add user settings columns: theme_preference and show_logs
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS theme_preference text CHECK (theme_preference IN ('system','light','dark')) DEFAULT 'system';

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS show_logs boolean DEFAULT false;

-- Grant select for new columns to anon/authenticated
GRANT SELECT (theme_preference, show_logs) ON public.users TO anon, authenticated;

-- Grant update permissions for new columns to authenticated (subject to RLS)
GRANT UPDATE (theme_preference, show_logs) ON public.users TO authenticated;

