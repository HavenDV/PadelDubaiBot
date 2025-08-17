"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Query hook for getting recent price for a location
export const useRecentPrice = (locationId?: number) => {
  return useQuery({
    queryKey: ['recent-price', locationId],
    queryFn: async () => {
      if (!locationId) return null;
      
      const { data, error } = await supabase
        .from("bookings")
        .select("price")
        .eq("location_id", locationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching recent price:", error);
        throw error;
      }
      
      return typeof data?.price === 'number' ? data.price : null;
    },
    enabled: !!locationId, // Only run query if locationId is provided
    staleTime: 2 * 60 * 1000,  // 2 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    retry: 1,
  });
};