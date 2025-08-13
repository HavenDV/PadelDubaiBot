"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (!sessionData.session) {
          setIsAdmin(false);
          return;
        }
        const { data } = await supabase.auth.getUser();
        setIsAdmin(Boolean(data.user?.app_metadata?.admin));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsAdmin(Boolean(session?.user?.app_metadata?.admin));
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading } as const;
}
