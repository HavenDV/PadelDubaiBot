"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Mutation hook for OAuth sign-in
export const useOAuthSignIn = () => {
  return useMutation({
    mutationFn: async (provider: "google") => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      
      if (error) {
        throw new Error(`OAuth ${provider} error: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Redirect to OAuth provider if URL is provided
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("OAuth sign-in error:", error);
    },
  });
};