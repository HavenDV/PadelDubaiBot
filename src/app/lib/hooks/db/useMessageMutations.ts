"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Mutation hook for deleting messages
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ telegramMessageId, chatId }: { 
      telegramMessageId: number; 
      chatId: number;
    }) => {
      // Get current session token for authorization
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/telegram/delete-message", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          messageId: telegramMessageId,
          chatId: chatId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete message");
      }

      return { telegramMessageId, chatId };
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Delete message error:", error);
    },
  });
};