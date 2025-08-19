"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Query hook for fetching all bookings data with related information
export const useBookingsData = () => {
  return useQuery({
    queryKey: ['bookings-data'],
    queryFn: async () => {
      const [bRes, lRes, tRes, rRes] = await Promise.all([
        supabase.from("bookings").select("*").order("id", { ascending: false }),
        supabase.from("locations").select("*").order("id"),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
        supabase.from("registrations").select(`
          *,
          user:users(id, first_name, last_name, username, photo_url, explicit_name)
        `).order("created_at", { ascending: true }),
      ]);
      
      if (bRes.error) throw bRes.error;
      if (lRes.error) throw lRes.error;
      if (tRes.error) throw tRes.error;
      if (rRes.error) throw rRes.error;

      const bookings = bRes.data ?? [];
      const locations = lRes.data ?? [];
      const registrations = rRes.data ?? [];
      const messages = tRes.data ?? [];

      // Create a lookup for messages by booking_id
      const telegramMessageLookup: { [key: number]: typeof messages } = {};
      messages.forEach((msg) => {
        if (!telegramMessageLookup[msg.booking_id]) {
          telegramMessageLookup[msg.booking_id] = [];
        }
        telegramMessageLookup[msg.booking_id].push(msg);
      });

      return {
        bookings,
        locations,
        registrations,
        telegramMessageLookup,
        messages,
      };
    },
    staleTime: 30 * 1000,      // 30 seconds - bookings change frequently
    gcTime: 5 * 60 * 1000,     // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Refresh when window gains focus
  });
};