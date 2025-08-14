"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TelegramLoginPayload } from "@/app/types/telegram-auth";
import { exchangeTelegramAuthViaLoginPayload } from "@/app/lib/telegram/auth";

export default function TelegramLoginCallbackPage() {
  const [status, setStatus] = useState<string>("Finalizing Telegram sign-in…");

  useEffect(() => {
    const run = async () => {
      try {
        // Already signed in? Go home
        const { data: initial } = await supabase.auth.getSession();
        if (initial.session) {
          window.location.replace("/");
          return;
        }

        const url = new URL(window.location.href);
        const params = url.searchParams;
        const id = params.get("id");
        const first_name = params.get("first_name");
        const last_name = params.get("last_name") ?? undefined;
        const username = params.get("username") ?? undefined;
        const photo_url = params.get("photo_url") ?? undefined;
        const auth_date = params.get("auth_date");
        const hash = params.get("hash");

        if (!id || !first_name || !auth_date || !hash) {
          setStatus("Missing Telegram login parameters.");
          return;
        }

        const payload: TelegramLoginPayload = {
          id: Number(id),
          first_name,
          last_name,
          username,
          photo_url,
          auth_date,
          hash,
        };

        const { access_token, refresh_token } =
          await exchangeTelegramAuthViaLoginPayload(payload);

        const { error: setErr } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (setErr) {
          setStatus(`Error establishing session: ${setErr.message}`);
          return;
        }

        window.location.replace("/");
      } catch (e) {
        console.error(e);
        setStatus("Unexpected error finalizing Telegram sign-in.");
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="text-base">{status}</div>
    </div>
  );
}
