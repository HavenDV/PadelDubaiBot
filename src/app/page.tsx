"use client";

import { JSX, useEffect, useState } from "react";
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
  const [showTelegramWidget, setShowTelegramWidget] = useState(false);
  const [telegramAuthUrl, setTelegramAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const allowedHost = "padel-dubai-bot-five.vercel.app";
    const isAllowed = window.location.hostname === allowedHost;
    setShowTelegramWidget(isAllowed);
    setTelegramAuthUrl(
      isAllowed ? `https://${allowedHost}/callbacks/auth/telegram` : null
    );
  }, []);

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
        <div className="w-full max-w-md rounded-2xl bg-white text-gray-900 shadow-lg border border-gray-200 p-6">
          <div className="text-center text-base mb-5">
            Please sign in to continue.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
              aria-label="Sign in with Google"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.046,6.053,28.761,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C33.046,6.053,28.761,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.191-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.094,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.191,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </button>
            {showTelegramWidget && telegramAuthUrl && (
              <div className="inline-flex rounded-md">
                <Script
                  async
                  src="https://telegram.org/js/telegram-widget.js?22"
                  data-telegram-login="padel_dubai_bot"
                  data-size="large"
                  data-radius="8"
                  data-auth-url={telegramAuthUrl}
                  data-request-access="write"
                  strategy="afterInteractive"
                />
              </div>
            )}
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
