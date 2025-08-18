"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { useAuth } from "@/app/contexts/AuthContext";

export function useShowLogs() {
  const [fallbackShow, setFallbackShow] = useState(false);
  const { telegramUserId, isAnonymous, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["user-settings", "show_logs", telegramUserId],
    queryFn: async () => {
      if (!telegramUserId) return null as { show_logs: boolean } | null;
      const { data, error } = await supabase
        .from("users")
        .select("show_logs")
        .eq("id", telegramUserId)
        .single();
      if (error) throw error;
      return data as { show_logs: boolean };
    },
    enabled: !!telegramUserId && isAdmin,
    staleTime: 2 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (value: boolean) => {
      if (!telegramUserId) return null;
      const { error } = await supabase
        .from("users")
        .update({ show_logs: value })
        .eq("id", telegramUserId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", "show_logs", telegramUserId] });
    },
  });

  const showLogs = data?.show_logs ?? fallbackShow;
  const setShowLogs = (value: boolean) => {
    setFallbackShow(value); // optimistic update for UI
    if (!isAnonymous && isAdmin && telegramUserId) {
      mutation.mutate(value);
    }
  };

  return { showLogs, setShowLogs } as const;
}

