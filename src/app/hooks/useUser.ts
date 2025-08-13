"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!isMounted) return;
        setUser(sessionData.session?.user ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

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

  return {
    user,
    email,
    firstName,
    avatarUrl,
    isAdmin,
    isAnonymous,
    isLoading,
  } as const;
}
