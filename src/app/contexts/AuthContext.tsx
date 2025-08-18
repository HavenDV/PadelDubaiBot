"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  // User data
  user: User | null;
  email: string | null;
  firstName: string | null;
  avatarUrl: string | null;
  telegramUserId: number | null;

  // Auth states
  isAdmin: boolean;
  isAnonymous: boolean;
  isLoading: boolean;

  // Auth actions (for future use)
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  // Single React Query instance for auth state
  const {
    data: user = null,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      return sessionData.session?.user ?? null;
    },
    staleTime: 30 * 1000, // Consider fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: true, // Refresh when window gains focus
  });

  // Set up auth state listener to update the query cache
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      // Update the query cache immediately when auth state changes
      queryClient.setQueryData(["auth-user"], newUser);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Computed properties based on user data
  const email = user?.email ?? null;

  const avatarUrl = useMemo(() => {
    const meta = user?.user_metadata as
      | { avatar_url?: string; picture?: string; photo_url?: string }
      | undefined;
    return meta?.avatar_url || meta?.picture || meta?.photo_url || null;
  }, [user]);

  const firstName = useMemo(() => {
    const nameMeta = user?.user_metadata as
      | {
          first_name?: string;
          given_name?: string;
          name?: string;
          full_name?: string;
        }
      | undefined;
    return (
      nameMeta?.first_name ||
      nameMeta?.given_name ||
      (nameMeta?.name ? nameMeta.name.split(" ")[0] : undefined) ||
      (nameMeta?.full_name ? nameMeta.full_name.split(" ")[0] : undefined) ||
      (email ? email.split("@")[0] : undefined) ||
      null
    );
  }, [user, email]);

  const isAdmin = Boolean(user?.app_metadata?.admin);
  const isAnonymous = !user;

  const telegramUserId = useMemo(() => {
    // Try to get Telegram user ID from app_metadata
    const appMeta = user?.app_metadata as { tg_id?: number } | undefined;
    return appMeta?.tg_id || null;
  }, [user]);

  const contextValue: AuthContextType = {
    // User data
    user,
    email,
    firstName,
    avatarUrl,
    telegramUserId,

    // Auth states
    isAdmin,
    isAnonymous,
    isLoading,

    // Auth actions
    refetchUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state and user data
 *
 * Provides centralized access to:
 * - User profile information
 * - Authentication status
 * - Permission checks (admin/anonymous)
 * - Computed user properties
 *
 * @returns AuthContextType with user data and auth state
 *
 * @example
 * ```typescript
 * function Component() {
 *   const { user, isAdmin, isLoading } = useAuth();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!user) return <LoginPrompt />;
 *
 *   return <div>Welcome {user.email}!</div>;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
