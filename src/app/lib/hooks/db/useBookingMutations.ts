"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { BookingInsert } from "../../../../../database.types";

// Mutation hook for creating bookings
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: BookingInsert) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Create booking error:", error);
    },
  });
};

// Mutation hook for updating bookings
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: Partial<BookingInsert> }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Update booking error:", error);
    },
  });
};

// Mutation hook for deleting bookings
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings data
      queryClient.invalidateQueries({ queryKey: ['bookings-data'] });
    },
    onError: (error) => {
      console.error("Delete booking error:", error);
    },
  });
};