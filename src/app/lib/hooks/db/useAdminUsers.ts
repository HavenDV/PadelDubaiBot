"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { User } from "../../../../../database.types";

// Query hook for getting admin users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const result = await supabase
        .from("users")
        .select(
          "id, first_name, last_name, username, photo_url, explicit_name, admin"
        )
        .eq("admin", true);

      if (result.error) {
        console.error("Error getAdminUsers:", result.error);
        throw result.error;
      }

      return result.data! as User[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (admin users don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};
