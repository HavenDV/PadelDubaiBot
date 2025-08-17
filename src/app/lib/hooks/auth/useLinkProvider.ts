"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Mutation hook for linking auth providers
export const useLinkProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: "google" | "apple") => {
      const { data, error } = await supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw new Error(`Error linking ${provider}: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // If we got a URL, redirect immediately
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Otherwise, invalidate the providers query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['auth-providers'] });
      }
    },
    onError: (error) => {
      console.error("Link provider error:", error);
    },
  });
};