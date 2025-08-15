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
  const { theme, isTelegram } = useTelegram();
  const { isAdmin, isAnonymous, isLoading } = useUser();

  const [activeScreen, setActiveScreen] = useState<ScreenName>("bookings");

  // Handle redirects after sign-in/sign-out
  useEffect(() => {
    if (!isLoading) {
      if (!isTelegram) {
        // Web mode: redirect to settings after sign-in, login after sign-out
        if (!isAnonymous && activeScreen === "login") {
          setActiveScreen("settings");
        } else if (isAnonymous && activeScreen !== "login") {
          setActiveScreen("login");
        }
      } else {
        // Telegram mode: redirect to settings after sign-in, stay on current screen when anonymous
        if (
          !isAnonymous &&
          (activeScreen === "bookings" || activeScreen === "locations")
        ) {
          setActiveScreen("settings");
        }
        // No redirect needed when becoming anonymous in Telegram - stay on current screen
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnonymous, isLoading, isTelegram]);

  const screens: Record<ScreenName, JSX.Element> = {
    settings: <Settings />,
    locations: <Locations />,
    bookings: <Bookings />,
    login: <Login />,
  };

  const visibleScreens = (() => {
    if (!isTelegram) {
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
