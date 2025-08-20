"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import type { Chat } from "../../../../../database.types";

// Hook for fetching all chats (admin only)
export const useChats = () => {
  return useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for fetching active chats only
export const useActiveChats = () => {
  return useQuery<Chat[]>({
    queryKey: ["active-chats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};
