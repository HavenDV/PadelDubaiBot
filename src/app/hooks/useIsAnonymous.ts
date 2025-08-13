"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";

export function useIsAnonymous() {
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!isMounted) return;
        setIsAnonymous(!sessionData.session);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsAnonymous(!session?.user);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { isAnonymous, isLoading } as const;
}
