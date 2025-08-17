"use client";

import { useState, useEffect } from "react";
import { usePlacesSearch } from "./usePlacesSearch";

// Hook that debounces the search query and uses the places search hook
export const useDebouncedPlacesSearch = (query: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  // Use the debounced query for the actual search
  const result = usePlacesSearch(debouncedQuery);

  return {
    ...result,
    // Indicate if we're waiting for debounce (query changed but not yet searched)
    isDebouncing: query !== debouncedQuery && query.trim().length >= 2,
  };
};