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

// Mutation hook for pinning messages in a Telegram chat
export const usePinMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      chatId,
      disableNotification = true,
    }: {
      messageId: number;
      chatId: number;
      disableNotification?: boolean;
    }) => {
      // Get current session token for authorization
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/telegram/pin-message", {
        method: "POST",
        headers,
        body: JSON.stringify({ messageId, chatId, disableNotification }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string })?.error || "Failed to pin message"
        );
      }

      return { messageId, chatId };
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data to reflect any potential state changes
      queryClient.invalidateQueries({ queryKey: ["bookings-data"] });
    },
    onError: (error) => {
      console.error("Pin message error:", error);
    },
  });
};

// Mutation hook for unpinning messages in a Telegram chat
export const useUnpinMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      chatId,
    }: {
      messageId?: number; // if omitted, unpins most recent
      chatId: number;
    }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/telegram/unpin-message", {
        method: "POST",
        headers,
        body: JSON.stringify({ messageId, chatId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string })?.error || "Failed to unpin message"
        );
      }

      return { messageId, chatId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings-data"] });
    },
    onError: (error) => {
      console.error("Unpin message error:", error);
    },
  });
};
