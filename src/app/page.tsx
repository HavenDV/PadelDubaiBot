"use client";

import { JSX, useState, useEffect } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "./hooks/useUser";
import Settings from "@components/settings";
import Navigation from "@components/navigation";
import ConsoleLoggerScript from "./components/debug/ConsoleLoggerScript";
import Locations from "./components/locations";
import Bookings from "./components/bookings";
import Login from "./components/login";

export type ScreenName = "settings" | "locations" | "bookings" | "login";

export default function Home() {
  const { webApp, theme, isLoading: isTelegramLoading, isAuthorizing } = useTelegram();
  const { isAdmin, isAnonymous, isLoading } = useUser();

  // Different default screens for web vs Telegram
  const getDefaultScreen = (): ScreenName => {
    if (webApp === null) {
      // Web mode: show login when anonymous, settings when authenticated
      return isAnonymous ? "login" : "settings";
    } else {
      // Telegram mode: show bookings when anonymous, settings when authenticated
      return isAnonymous ? "bookings" : "settings";
    }
  };

  const [activeScreen, setActiveScreen] = useState<ScreenName>(getDefaultScreen());

  // Handle redirects after sign-in/sign-out
  useEffect(() => {
    if (!isLoading) {
      if (webApp === null) {
        // Web mode: redirect to settings after sign-in, login after sign-out
        if (!isAnonymous && activeScreen === "login") {
          setActiveScreen("settings");
        } else if (isAnonymous && activeScreen !== "login") {
          setActiveScreen("login");
        }
      } else {
        // Telegram mode: redirect to settings after sign-in, stay on current screen when anonymous
        if (!isAnonymous && (activeScreen === "bookings" || activeScreen === "locations")) {
          setActiveScreen("settings");
        }
        // No redirect needed when becoming anonymous in Telegram - stay on current screen
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnonymous, isLoading, webApp]);

  const screens: Record<ScreenName, JSX.Element> = {
    settings: <Settings />,
    locations: <Locations />,
    bookings: <Bookings />,
    login: <Login />,
  };

  // Show a brief loading screen only when a logged-in session is being resolved
  if (!isAnonymous && (isTelegramLoading || isAuthorizing || isLoading)) {
    const loadingMessage = isAuthorizing ? "Authorizing…" : "Loading account…";

    return (
      <div
        className={`${theme.bg} ${theme.text} flex min-h-[100dvh] w-full items-center justify-center p-6`}
      >
        <div className="text-base">{loadingMessage}</div>
      </div>
    );
  }

  const visibleScreens = (() => {
    if (webApp === null) {
      // Web mode: show login when anonymous
      return isAnonymous
        ? (["login", "locations", "bookings"] as ScreenName[])
        : (["locations", "bookings"] as ScreenName[]);
    } else {
      // Telegram mode: never show login, always show locations and bookings
      return ["locations", "bookings"] as ScreenName[];
    }
  })();

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
