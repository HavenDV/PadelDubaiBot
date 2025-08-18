"use client";

import { JSX, useState, useEffect } from "react";
import { useTelegram, useTelegramTheme } from "@/app/hooks/telegram";
import { useAuth } from "@/app/contexts/AuthContext";
import { useShowLogs } from "@/app/hooks/settings/useShowLogs";
import Settings from "@/app/components/settings/settings";
import Navigation from "@components/navigation";
import ConsoleLoggerScript from "./components/debug/ConsoleLoggerScript";
import Locations from "./components/locations/locations";
import Bookings from "./components/bookings/bookings";
import Login from "./components/login/login";

export type ScreenName = "settings" | "locations" | "bookings" | "login";

export default function Home() {
  const { isTelegram } = useTelegram();
  const { styles, themeParams, colorScheme } = useTelegramTheme();
  const { isAdmin, isAnonymous, isLoading } = useAuth();
  const { showLogs } = useShowLogs();

  const [activeScreen, setActiveScreen] = useState<ScreenName>("bookings");
  const [lastThemeChange, setLastThemeChange] = useState<string>("");

  // Track theme changes
  useEffect(() => {
    if (themeParams) {
      setLastThemeChange(new Date().toLocaleTimeString());
    }
  }, [themeParams]);

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
        : ([
            "bookings",
            ...(isAdmin ? (["locations"] as ScreenName[]) : []),
          ] as ScreenName[]);
    } else {
      // Telegram mode: never show login; Locations only for admins
      return [
        "bookings",
        ...(isAdmin ? (["locations"] as ScreenName[]) : []),
      ] as ScreenName[];
    }
  })();

  return (
    <>
      <div className={`flex min-h-[100dvh] w-full flex-col`} style={styles.bg}>
        {/* Theme Debug Panel - Only visible to admins when logs are enabled */}
        {isAdmin && showLogs && isTelegram && (
          <div 
            className="fixed top-2 right-2 z-50 p-2 text-xs rounded border max-w-xs"
            style={{
              ...styles.card,
              fontSize: '10px',
              opacity: 0.8
            }}
          >
            <div style={styles.text}>Theme Debug</div>
            <div style={styles.secondaryText}>
              Color: {colorScheme || 'null'}
            </div>
            <div style={styles.secondaryText}>
              BG: {themeParams?.bg_color || 'null'}
            </div>
            <div style={styles.secondaryText}>
              Text: {themeParams?.text_color || 'null'}
            </div>
            <div style={styles.secondaryText}>
              Button: {themeParams?.button_color || 'null'}
            </div>
            <div style={styles.secondaryText}>
              Accent: {themeParams?.accent_text_color || 'null'}
            </div>
            {lastThemeChange && (
              <div style={styles.secondaryText}>
                Updated: {lastThemeChange}
              </div>
            )}
            {/* Visual test elements */}
            <div className="mt-2 space-y-1">
              <div 
                className="px-2 py-1 rounded text-xs"
                style={{
                  ...styles.primaryButton,
                  fontSize: '10px'
                }}
              >
                Button Test
              </div>
              <div style={{
                ...styles.accentText,
                fontSize: '10px'
              }}>
                Accent Text
              </div>
              <div style={{
                ...styles.link,
                fontSize: '10px'
              }}>
                Link Text
              </div>
            </div>
          </div>
        )}
        
        <Navigation
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          screenNames={visibleScreens}
        />
        {screens[activeScreen]}
        {/* <Footer setActiveScreen={setActiveScreen}/> */}
      </div>
      {isAdmin && showLogs && <ConsoleLoggerScript />}
    </>
  );
}
