"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";

// Mutation hook for adding registration
export const useAddRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, userId }: { bookingId: number, userId: number }) => {
      const { data, error } = await supabase
        .from("registrations")
        .insert({
          booking_id: bookingId,
          user_id: userId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data to update registration counts
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Add registration error:", error);
    },
  });
};

// Mutation hook for removing registration
export const useRemoveRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, userId }: { bookingId: number, userId: number }) => {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("booking_id", bookingId)
        .eq("user_id", userId);
      
      if (error) throw error;
      return { bookingId, userId };
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data to update registration counts
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Remove registration error:", error);
    },
  });
};

// Mutation hook for removing registration by admin (by registration ID)
export const useRemoveRegistrationById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: number) => {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", registrationId);
      
      if (error) throw error;
      return registrationId;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data to update registration counts
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Remove registration by ID error:", error);
    },
  });
};