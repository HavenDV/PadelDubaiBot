"use client";

import { JSX, useState, useEffect } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "./hooks/useUser";
import Settings from "@/app/components/settings/settings";
import Navigation from "@components/navigation";
import ConsoleLoggerScript from "./components/debug/ConsoleLoggerScript";
import Locations from "./components/locations/locations";
import Bookings from "./components/bookings/bookings";
import Login from "./components/login/login";

export type ScreenName = "settings" | "locations" | "bookings" | "login";

export default function Home() {
  const { styles, isTelegram } = useTelegram();
  const { isAdmin, isAnonymous, isLoading } = useUser();

  const [activeScreen, setActiveScreen] = useState<ScreenName>("bookings");

  // Handle redirects after sign-in/sign-out and restrict non-admin access to Locations
  useEffect(() => {
    if (!isLoading) {
      if (!isTelegram) {
        // Web mode: redirect to settings after sign-in, login after sign-out
        if (!isAnonymous && activeScreen === "login") {
          setActiveScreen("settings");
        } else if (isAnonymous && activeScreen !== "login") {
          setActiveScreen("login");
        }
        // Restrict Locations to admins in web mode
        if (!isAnonymous && !isAdmin && activeScreen === "locations") {
          setActiveScreen("bookings");
        }
      } else {
        // Telegram mode: redirect to settings after sign-in, stay on current screen when anonymous
        if (
          !isAnonymous &&
          (activeScreen === "bookings" || activeScreen === "locations")
        ) {
          setActiveScreen("settings");
        }
        // Restrict Locations to admins in Telegram mode
        if (!isAnonymous && !isAdmin && activeScreen === "locations") {
          setActiveScreen("bookings");
        }
        // No redirect needed when becoming anonymous in Telegram - stay on current screen
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnonymous, isLoading, isTelegram, isAdmin]);

  const screens: Record<ScreenName, JSX.Element> = {
    settings: <Settings />,
    locations: <Locations />,
    bookings: <Bookings />,
    login: <Login />,
  };

  const visibleScreens = (() => {
    if (!isTelegram) {
      // Web mode: show login when anonymous; Locations only for admins
      return isAnonymous
        ? (["login", "bookings"] as ScreenName[])
        : (["bookings", ...(isAdmin ? (["locations"] as ScreenName[]) : [])] as ScreenName[]);
    } else {
      // Telegram mode: never show login; Locations only for admins
      return (["bookings", ...(isAdmin ? (["locations"] as ScreenName[]) : [])] as ScreenName[]);
    }
  })();

  return (
    <>
      <div 
        className={`flex min-h-[100dvh] w-full flex-col`}
        style={styles.bg}
      >
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
