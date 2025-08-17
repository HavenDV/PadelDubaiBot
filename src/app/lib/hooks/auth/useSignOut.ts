"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Mutation hook for signing out
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear all queries when signing out
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });
};