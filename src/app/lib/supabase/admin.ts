import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types.gen";

// Admin client with service role key for server-side operations
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);