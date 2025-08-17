"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Query hook for fetching all locations
export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("id");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,  // 5 minutes - locations don't change often
    gcTime: 15 * 60 * 1000,    // 15 minutes
    retry: 1,
  });
};