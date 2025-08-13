"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useTelegramTheme } from "../hooks/useTelegramTheme";
import { setAuthToken } from "@lib/supabase/client";
import type {
  TelegramAuthResponse,
  TelegramAuthErrorResponse,
} from "../types/telegram-auth";
import { WebApp, ThemeParams, WebAppInitData } from "telegram-web-app";

interface TelegramContextType {
  webApp: WebApp | null; // Make webApp nullable for SSR
  isLoading: boolean;
  themeParams: ThemeParams | null;
  theme: ReturnType<typeof useTelegramTheme>;
  userId: number | null; // Add userId for easier access
}

const TelegramContext = createContext<TelegramContextType | undefined>(
  undefined
);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Generate theme styles based on themeParams
  const theme = useTelegramTheme(themeParams);

  // Function to initialize Supabase with the token
  const initializeSupabase = (accessToken: string, refreshToken?: string) => {
    setAuthToken(accessToken, refreshToken);
    console.log(
      "TelegramProvider: set Authorization header with JWT",
      accessToken.substring(0, 10) + "…"
    );
  };

  // Token helpers removed (web mode uses supabase-js session management directly)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Guard against server-side rendering - Telegram WebApp only exists in browser
      const isBrowser = typeof window !== "undefined";

      // Check if Telegram WebApp is available (only in browser client-side)
      if (isBrowser && window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Notify Telegram WebApp that we are ready
        window.Telegram.WebApp.ready();

        // Expand the WebApp to fullscreen
        //window.Telegram.WebApp.expand();

        if (!webApp.initData) {
          setIsLoading(false);
          return;
        }

        // Subscribe to theme changes
        const handleThemeChange = () => {
          setThemeParams(webApp.themeParams || null);
        };

        // Call our API to validate the data and get a Supabase token
        try {
          const response = await fetch("/api/telegram/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initDataRaw: webApp.initData }),
          });

          if (!response.ok) {
            const errorData: TelegramAuthErrorResponse = await response.json();
            console.error("Authentication error:", errorData.error);
            throw new Error(errorData.error || "Authentication failed");
          }

          const { access_token, refresh_token }: TelegramAuthResponse =
            await response.json();

          // Set the token in Supabase client
          initializeSupabase(access_token, refresh_token);

          setWebApp(webApp);

          // Set theme parameters safely
          setThemeParams(webApp.themeParams || null);

          // Parse init data from Telegram WebApp
          let initData: WebAppInitData = { auth_date: 0, hash: "" };
          try {
            initData = webApp.initDataUnsafe as WebAppInitData;
          } catch (error) {
            console.error("Error parsing initData:", error);
          }

          webApp.onEvent("themeChanged", handleThemeChange);

          if (initData?.user) {
            const { id } = initData.user;

            setUserId(id);
          }
        } catch (error) {
          console.error("Authentication error:", error);
          setIsLoading(false);
        }

        setIsLoading(false);

        // Return cleanup function
        return () => {
          webApp.offEvent("themeChanged", handleThemeChange);
        };
      } else {
        // For server-side rendering or when Telegram WebApp isn't available
        console.log("Telegram WebApp not available - using default theme");
        setWebApp(null);
        setThemeParams(null);

        setIsLoading(false);

        // Return empty cleanup function
        return () => {};
      }
    };

    fetchData();
  }, [userId]);

  // isAnonymous is now provided by a dedicated hook; keep this provider focused on Telegram-only concerns

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        isLoading,
        themeParams,
        theme,
        userId,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
}
