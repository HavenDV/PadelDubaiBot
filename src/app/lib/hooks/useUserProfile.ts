"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@lib/supabase-queries";

// Query hook for user profile data
export const useUserProfile = (userId?: number) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 2 * 60 * 1000,  // 2 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 1,
  });
};