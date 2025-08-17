"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Type for skill levels
export type SkillLevel = "E" | "D" | "D+" | "C-" | "C" | "C+";

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
    onSuccess: (data, variables) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.userId] });
    },
    onError: (error) => {
      console.error("Update skill level error:", error);
    },
  });
};
