"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { User } from "../../../../../database.types";

// Query hook for getting users by IDs
export const useUsersByIds = (userIds: number[]) => {
  return useQuery({
    queryKey: ["users-by-ids", userIds.sort().join(",")],
    queryFn: async () => {
      if (userIds.length === 0) return [];

      const result = await supabase
        .from("users")
        .select("id, first_name, last_name, username, photo_url, explicit_name")
        .in("id", userIds);

      if (result.error) {
        console.error("Error getUsersByIds:", result.error);
        throw result.error;
      }

      return result.data! as User[];
    },
    enabled: userIds.length > 0, // Only run query if userIds are provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};
