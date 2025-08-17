-- Add skill_level to SELECT permissions for authenticated and anon users
REVOKE SELECT ON public.users FROM authenticated, anon;
GRANT SELECT (id, first_name, last_name, username, photo_url, explicit_name, created_at, updated_at, admin, skill_level) ON public.users TO authenticated, anon;

-- Add skill_level to UPDATE permissions for authenticated users
REVOKE UPDATE ON public.users FROM authenticated;
GRANT UPDATE (explicit_name, skill_level) ON public.users TO authenticated;