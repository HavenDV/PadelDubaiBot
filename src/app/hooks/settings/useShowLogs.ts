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
    onMutate: async (value: boolean) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-settings", "show_logs", telegramUserId] });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(["user-settings", "show_logs", telegramUserId]);
      
      // Optimistically update
      queryClient.setQueryData(["user-settings", "show_logs", telegramUserId], { show_logs: value });
      
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["user-settings", "show_logs", telegramUserId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", "show_logs", telegramUserId] });
    },
  });

  const showLogs = data?.show_logs ?? fallbackShow;
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const setShowLogs = (value: boolean) => {
    setFallbackShow(value); // optimistic update for UI
    if (!isAnonymous && isAdmin && telegramUserId) {
      setPendingValue(value);
      mutation.mutate(value, {
        onSettled: () => {
          setPendingValue(null);
        }
      });
    }
  };

  return { 
    showLogs, 
    setShowLogs,
    isPending: mutation.isPending,
    pendingValue
  } as const;
}

