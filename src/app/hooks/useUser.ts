"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/lib/supabase/client";

export function useUser() {
  const queryClient = useQueryClient();

  // Use React Query for the initial auth state
  const { data: user = null, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      return sessionData.session?.user ?? null;
    },
    staleTime: 30 * 1000,      // Consider fresh for 30 seconds
    gcTime: 5 * 60 * 1000,     // Keep in cache for 5 minutes
    retry: 1,                   // Retry once on failure
    refetchOnWindowFocus: true, // Refresh when window gains focus
  });

  // Set up auth state listener to update the query cache
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      // Update the query cache immediately when auth state changes
      queryClient.setQueryData(['auth-user'], newUser);
    });
    
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Computed properties based on user data
  const email = user?.email ?? null;

  const avatarUrl = useMemo(() => {
    const meta = user?.user_metadata as
      | { avatar_url?: string; picture?: string; photo_url?: string }
      | undefined;
    return meta?.avatar_url || meta?.picture || meta?.photo_url || null;
  }, [user]);

  const firstName = useMemo(() => {
    const nameMeta = user?.user_metadata as
      | {
          first_name?: string;
          given_name?: string;
          name?: string;
          full_name?: string;
        }
      | undefined;
    return (
      nameMeta?.first_name ||
      nameMeta?.given_name ||
      (nameMeta?.name ? nameMeta.name.split(" ")[0] : undefined) ||
      (nameMeta?.full_name ? nameMeta.full_name.split(" ")[0] : undefined) ||
      (email ? email.split("@")[0] : undefined) ||
      null
    );
  }, [user, email]);

  const isAdmin = Boolean(user?.app_metadata?.admin);
  const isAnonymous = !user;

  return {
    user,
    email,
    firstName,
    avatarUrl,
    isAdmin,
    isAnonymous,
    isLoading,
  } as const;
}