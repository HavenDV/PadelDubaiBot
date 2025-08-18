"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase/client";
import { useAuth } from "@/app/contexts/AuthContext";

export type ThemePreference = "system" | "light" | "dark";

export function useThemePreference() {
  const { telegramUserId, isAnonymous } = useAuth();
  const queryClient = useQueryClient();

  // Fallback cache before server responds
  const [fallbackPref, setFallbackPref] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system";
    const tp = window.localStorage?.getItem("themePreference");
    return tp === "light" || tp === "dark" || tp === "system" ? tp : "system";
  });

  const { data } = useQuery({
    queryKey: ["user-settings", "theme_preference", telegramUserId],
    queryFn: async () => {
      if (!telegramUserId) return null as { theme_preference: ThemePreference } | null;
      const { data, error } = await supabase
        .from("users")
        .select("theme_preference")
        .eq("id", telegramUserId)
        .single();
      if (error) throw error;
      return data as { theme_preference: ThemePreference };
    },
    enabled: !!telegramUserId,
    staleTime: 2 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (pref: ThemePreference) => {
      if (!telegramUserId) return null;
      const { error } = await supabase
        .from("users")
        .update({ theme_preference: pref })
        .eq("id", telegramUserId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", "theme_preference", telegramUserId] });
    },
  });

  const themePreference: ThemePreference = data?.theme_preference ?? fallbackPref;

  const setThemePreference = (pref: ThemePreference) => {
    setFallbackPref(pref); // optimistic local update before server response
    if (!isAnonymous && telegramUserId) {
      mutation.mutate(pref);
    }
  };

  // Track OS color scheme (client-only)
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mql.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return { themePreference, setThemePreference, systemPrefersDark } as const;
}
