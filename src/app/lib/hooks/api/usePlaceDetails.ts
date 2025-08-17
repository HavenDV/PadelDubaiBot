"use client";

import { useQuery } from "@tanstack/react-query";

// Type for Google Places details result
export interface PlaceDetailsData {
  name?: string;
  url?: string;
  address?: string;
  phone?: string;
  website?: string;
  plus_code?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: string[];
  place_id?: string;
  lat?: number;
  lng?: number;
}

interface PlaceDetailsResponse {
  success: boolean;
  data: PlaceDetailsData;
  error?: string;
}

// Query hook for Google Places details
export const usePlaceDetails = (placeId?: string) => {
  return useQuery({
    queryKey: ['place-details', placeId],
    queryFn: async () => {
      if (!placeId) {
        throw new Error('Place ID is required');
      }

      const res = await fetch(`/api/places/details?place_id=${encodeURIComponent(placeId)}`);
      
      if (!res.ok) {
        throw new Error(`Place details fetch failed: ${res.status}`);
      }
      
      const data: PlaceDetailsResponse = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load place details');
      }
      
      return data.data;
    },
    enabled: !!placeId, // Only fetch if placeId is provided
    staleTime: 30 * 60 * 1000,  // 30 minutes - place details change rarely
    gcTime: 60 * 60 * 1000,     // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  });
};