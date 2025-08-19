import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Database } from "../../../../database.types.gen";

/**
 * Validates that the user is authenticated and has admin permissions
 * Uses Authorization header with Bearer token
 */
export async function validateAdminUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: "Missing or invalid authorization header", status: 401 };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    // Create supabase client with the user's token
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Get the current user from JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Invalid or expired token", status: 401 };
    }

    // Check if user is admin using the database function
    const { data: isAdminData, error: adminError } = await supabase
      .rpc('is_admin');
      
    if (adminError) {
      console.error("Admin check error:", adminError);
      return { error: "Failed to verify admin permissions", status: 500 };
    }

    if (!isAdminData) {
      return { error: "Admin permissions required", status: 403 };
    }

    return { user, supabase };
  } catch (error) {
    console.error("Auth validation error:", error);
    return { error: "Authentication failed", status: 401 };
  }
}