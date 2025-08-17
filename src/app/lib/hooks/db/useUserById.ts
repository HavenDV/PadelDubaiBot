"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { User } from "../../../../../database.types";

// Query hook for getting a single user by ID
export const useUserById = (userId?: number) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const result = await supabase
        .from("users")
        .select(
          "id, first_name, last_name, username, photo_url, explicit_name, admin"
        )
        .eq("id", userId);

      if (result.error) {
        console.error("Error getUser:", result.error);
        throw result.error;
      }

      return result.data![0] as User;
    },
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};
