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
  const { theme, isLoading: isTelegramLoading, isAuthorizing } = useTelegram();
  const { isAdmin, isAnonymous, isLoading } = useUser();

  const [activeScreen, setActiveScreen] = useState<ScreenName>(
    isAnonymous ? "login" : "settings"
  );

  // Handle redirects after sign-in/sign-out
  useEffect(() => {
    if (!isLoading) {
      // Redirect to settings after successful sign-in
      if (!isAnonymous && activeScreen === "login") {
        setActiveScreen("settings");
      }
      // Redirect to login after sign-out
      else if (isAnonymous && activeScreen !== "login") {
        setActiveScreen("login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnonymous, isLoading]);

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

  const visibleScreens = isAnonymous
    ? (["login", "locations", "bookings"] as ScreenName[])
    : (["locations", "bookings"] as ScreenName[]);

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
