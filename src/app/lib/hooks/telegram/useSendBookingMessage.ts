"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { MessageFormatter, REGISTRATION_BUTTONS } from "@/app/lib/telegram";
import type { Booking, Location, User } from "../../../../../database.types";

interface BookingMessageData {
  booking: Booking;
  location: Location;
  registrations: Array<{
    user: Pick<User, "id" | "username" | "first_name" | "skill_level">;
  }>;
  chatId: string | number; // Chat ID for sending message
}

export const useSendBookingMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      booking,
      location,
      registrations,
      chatId,
    }: BookingMessageData) => {
      // Format the message
      const gameMessage = MessageFormatter.formatBookingMessage({
        booking,
        location,
        registrations,
      });

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

      // Send message via API
      const response = await fetch("/api/telegram/send-message", {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: gameMessage,
          chatId: chatId,
          parseMode: "HTML",
          replyMarkup: booking.cancelled
            ? undefined
            : {
                inline_keyboard: REGISTRATION_BUTTONS,
              },
          bookingId: booking.id, // Include booking ID for database storage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Send message API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          chatId: chatId,
          bookingId: booking.id,
        });
        throw new Error(
          errorData.error || `Failed to send message (${response.status})`
        );
      }

      const { messageId, chatId: responseChatId } = await response.json();

      return { messageId, chatId: responseChatId, bookingId: booking.id };
    },
    onSuccess: () => {
      // Refresh bookings data to show updated message status
      queryClient.invalidateQueries({ queryKey: ["bookings-data"] });
    },
    onError: (error) => {
      console.error("Send booking message error:", {
        message: error.message,
        stack: error.stack,
        error: error,
      });
    },
  });
};
