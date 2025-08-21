"use client";

import { useMutation } from "@tanstack/react-query";

type Payload = { bookingId: number } | { chatId: number; messageId: number };

export function useUpdateTelegramMessages() {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await fetch("/api/telegram/update-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to update Telegram messages (${res.status})`);
      }
      return (await res.json()) as { success: boolean; processed: number; failed: number };
    },
  });
}
