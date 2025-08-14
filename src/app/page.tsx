"use client";

import { JSX, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "./hooks/useUser";
import { supabase } from "@/app/lib/supabase/client";
import Script from "next/script";
import Settings from "@components/settings";
import Navigation from "@components/navigation";
import ConsoleLoggerScript from "./components/debug/ConsoleLoggerScript";
import Locations from "./components/locations";
import Bookings from "./components/bookings";
// import GameSchedules from "@components/game-schedules";
// import GameLocations from "@components/game-locations";
// import History from "@components/history";

export type ScreenName =
  // | "history"
  "settings" | "locations" | "bookings";
// | "locations"
// | "schedules"

export default function Home() {
  const { theme, isLoading: isTelegramLoading, isAuthorizing } = useTelegram();
  const { isAdmin, isAnonymous, isLoading } = useUser();

  const [activeScreen, setActiveScreen] = useState<ScreenName>("settings");

  const screens: Record<ScreenName, JSX.Element> = {
    settings: <Settings />,
    locations: <Locations />,
    bookings: <Bookings />,
    // history: <History />,
    // schedules: <GameSchedules />,
  };

  // Get visible navigation items (settings is accessed via avatar)
  if (isTelegramLoading || isAuthorizing || isLoading) {
    const loadingMessage = isTelegramLoading
      ? "Initializing Telegram…"
      : isAuthorizing
      ? "Authorizing…"
      : "Loading account…";

    return (
      <div
        className={`${theme.bg} ${theme.text} flex min-h-[100dvh] w-full items-center justify-center p-6`}
      >
        <div className="text-base">{loadingMessage}</div>
      </div>
    );
  }

  if (isAnonymous) {
    const handleOAuthLogin = async (provider: "google") => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams:
            provider === "google"
              ? { access_type: "offline", prompt: "consent" }
              : undefined,
        },
      });
      if (error) {
        console.error(`OAuth ${provider} error:`, error.message);
        return;
      }
      if (data?.url) window.location.href = data.url;
    };

    return (
      <div
        className={`${theme.bg} ${theme.text} flex min-h-[100dvh] items-center justify-center p-6`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`text-base`}>Please sign in to continue.</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              className="px-4 py-2 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
              aria-label="Sign in with Google"
            >
              Continue with Google
            </button>
            <Script
              async
              src="https://telegram.org/js/telegram-widget.js?22"
              data-telegram-login="padel_dubai_bot"
              data-size="large"
              data-auth-url={`${
                typeof window !== "undefined" ? window.location.origin : ""
              }/callbacks/auth/telegram`}
              data-request-access="write"
              strategy="afterInteractive"
            />
          </div>
        </div>
      </div>
    );
  }

  const visibleScreens = isAdmin
    ? (["locations", "bookings"] as ScreenName[])
    : ([] as ScreenName[]);

  return (
    <>
      <div className={`${theme.bg} flex min-h-[100dvh] w-full flex-col`}>
        <Navigation
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          screenNames={visibleScreens}
        />
        {screens[activeScreen]}
        {/* <Footer setActiveScreen={setActiveScreen}/> */}
      </div>
      {isAdmin && <ConsoleLoggerScript />}
    </>
  );
}
