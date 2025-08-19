"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import type { User } from "../../../../database.types";

// Type for skill levels
export type SkillLevel = "E" | "D-" | "D" | "D+" | "D++" | "C-" | "C" | "C+";

// Mutation hook for updating user skill level
export const useUpdateUserSkillLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, skillLevel }: { userId: number, skillLevel: SkillLevel }) => {
      const { data, error } = await supabase
        .from("users")
        .update({
          skill_level: skillLevel,
        })
        .eq("id", userId)
        // Only select columns the client has SELECT privileges for
        .select(
          "id, first_name, last_name, username, photo_url, explicit_name, created_at, updated_at, admin, skill_level"
        )
        .single();
      
      if (error) throw error;
      return data;
    },
    onMutate: async ({ userId, skillLevel }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['user-profile', userId] });

      // Snapshot the previous value
      const previousUserProfile = queryClient.getQueryData(['user-profile', userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['user-profile', userId], (old: User | undefined) => {
        if (!old) return old;
        return {
          ...old,
          skill_level: skillLevel
        };
      });

      // Return a context object with the snapshotted value
      return { previousUserProfile };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUserProfile) {
        queryClient.setQueryData(['user-profile', variables.userId], context.previousUserProfile);
      }
      console.error("Update skill level error:", error);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.userId] });
    },
  });
};
