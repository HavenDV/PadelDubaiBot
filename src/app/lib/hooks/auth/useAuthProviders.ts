"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Query hook for linked auth providers
export const useLinkedProviders = (isAnonymous: boolean) => {
  return useQuery({
    queryKey: ['auth-providers'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error loading auth user:", error);
        throw error;
      }
      const user = data.user;
      const providers = (user?.identities ?? [])
        .map((i) => i.provider)
        .filter(Boolean) as string[];
      return providers;
    },
    enabled: !isAnonymous, // Only run when user is authenticated
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    retry: 1,
  });
};