"use client";

import { useQuery } from "@tanstack/react-query";

// Type for Google Places search result
interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  lat: number | null;
  lng: number | null;
}

interface PlacesSearchResponse {
  success: boolean;
  candidates: PlaceSearchResult[];
  error?: string;
}

// Query hook for Google Places search
export const usePlacesSearch = (query: string) => {
  return useQuery({
    queryKey: ['places-search', query.trim()],
    queryFn: async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery || trimmedQuery.length < 2) {
        return { success: true, candidates: [] };
      }

      const res = await fetch(`/api/places/search?q=${encodeURIComponent(trimmedQuery)}`);
      
      if (!res.ok) {
        throw new Error(`Places search failed: ${res.status}`);
      }
      
      const data: PlacesSearchResponse = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Places search failed');
      }
      
      return data;
    },
    enabled: query.trim().length >= 2, // Only search if query is at least 2 characters
    staleTime: 5 * 60 * 1000,  // 5 minutes - search results are fairly stable
    gcTime: 15 * 60 * 1000,    // 15 minutes
    retry: 1,
    // Debounce search queries to avoid too many API calls
    refetchOnWindowFocus: false,
  });
};