"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import Link from "next/link";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<string>("Completing account linking...");

  useEffect(() => {
    const run = async () => {
      try {
        // If a session already exists, redirect home immediately
        const { data: initialSession } = await supabase.auth.getSession();
        if (initialSession.session) {
          window.location.replace("/");
          return;
        }

        const url = new URL(window.location.href);
        const hasCode = !!url.searchParams.get("code");

        if (hasCode) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exchangeError) {
            // Some browsers may block storage causing PKCE verifier missing; check if session exists anyway
            const { data: postExchange } = await supabase.auth.getSession();
            if (postExchange.session) {
              window.location.replace("/");
              return;
            }
            setStatus(`Error establishing session: ${exchangeError.message}`);
            return;
          }
        } else if (window.location.hash.includes("access_token")) {
          // Handle implicit grant tokens in URL hash
          const hash = new URLSearchParams(window.location.hash.substring(1));
          const access_token = hash.get("access_token") ?? undefined;
          const refresh_token = hash.get("refresh_token") ?? undefined;
          if (access_token && refresh_token) {
            const { error: setErr } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (setErr) {
              setStatus(`Error setting session: ${setErr.message}`);
              return;
            }
          } else {
            setStatus(
              "Returned without auth code or tokens. Check redirect URL configuration."
            );
            return;
          }
        } else {
          setStatus(
            "Missing auth code. Ensure redirect URL matches exactly and the flow was initiated from this site."
          );
          return;
        }

        // If we reached here without errors, redirect home to clear long URLs and hashes
        const { data: finalSession } = await supabase.auth.getSession();
        if (finalSession.session) {
          window.location.replace("/");
          return;
        }
        setStatus("Signed in, but no active session detected.");
      } catch (e) {
        setStatus("Unexpected error completing authentication");

        console.error(e);
      }
    };
    run();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <div className="text-lg">{status}</div>
      <Link
        href="/"
        className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
      >
        Go home
      </Link>
    </div>
  );
}
