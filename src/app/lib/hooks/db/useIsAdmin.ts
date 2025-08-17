"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Query hook for checking if user is admin
export const useIsAdmin = (id?: number) => {
  return useQuery({
    queryKey: ['user-admin', id],
    queryFn: async () => {
      if (!id) return false;
      
      // Prefer checking admin flag from JWT app_metadata to avoid table reads
      const { data: auth } = await supabase.auth.getUser();
      const jwtAdmin = Boolean(auth.user?.app_metadata?.admin);
      if (jwtAdmin) return true;
      
      // Fallback for non-telegram web mode where admin column may be needed
      const result = await supabase
        .from("users")
        .select("admin")
        .eq("id", id)
        .limit(1);
      
      if (result.error) throw result.error;
      if (!result.data || result.data.length !== 1)
        throw new Error("User not found");
      
      return Boolean(result.data[0].admin);
    },
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    retry: 1,
  });
};