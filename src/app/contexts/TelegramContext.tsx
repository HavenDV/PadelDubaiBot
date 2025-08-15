"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useTelegramTheme } from "../hooks/useTelegramTheme";
import { setAuthToken, supabase } from "@lib/supabase/client";
import { WebApp, ThemeParams, WebAppInitData } from "telegram-web-app";
import { exchangeTelegramAuthViaInitData } from "../lib/telegram/auth";

interface TelegramContextType {
  webApp: WebApp | null; // Make webApp nullable for SSR
  isLoading: boolean;
  isAuthorizing: boolean;
  themeParams: ThemeParams | null;
  theme: ReturnType<typeof useTelegramTheme>;
  userId: number | null; // Add userId for easier access
  isTelegram: boolean; // Better Telegram mode detection
}

const TelegramContext = createContext<TelegramContextType | undefined>(
  undefined
);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isTelegram, setIsTelegram] = useState(true);

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

  // Function to check if we have a valid session (Supabase handles refresh automatically)
  const hasValidSession = async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log("TelegramProvider: No valid session found");
        return false;
      }

      console.log("TelegramProvider: Valid session exists");
      return true;
    } catch (error) {
      console.error("TelegramProvider: Error checking session:", error);
      return false;
    }
  };

  // Token helpers removed (web mode uses supabase-js session management directly)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Guard against server-side rendering - Telegram WebApp only exists in browser
      const isBrowser = typeof window !== "undefined";

      // Check if we're actually running in Telegram (not just having the script available)
      if (isBrowser && window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Proper Telegram detection: check if we have actual Telegram context
        // Only rely on initData or actual user data, not version (version exists in web too)
        const isActuallyInTelegram = Boolean(
          (webApp.initData && webApp.initData.length > 0) ||
            webApp.initDataUnsafe?.user
        );

        setIsTelegram(isActuallyInTelegram);

        if (!isActuallyInTelegram) {
          // Not actually in Telegram, just web mode with script loaded
          setWebApp(null);
          setThemeParams(null);
          setIsAuthorizing(false);
          setIsLoading(false);
          return () => {};
        }

        // Only proceed with Telegram-specific initialization if actually in Telegram
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

        // Check if we need to reauth by validating current session
        const needsReauth = !(await hasValidSession());
        
        if (needsReauth) {
          console.log("TelegramProvider: No valid session, authenticating...");
          
          // Call our API to validate the data and get a Supabase token
          try {
            setIsAuthorizing(true);
            const { access_token, refresh_token } =
              await exchangeTelegramAuthViaInitData(webApp.initData);

            // Set the token in Supabase client
            initializeSupabase(access_token, refresh_token);
          } catch (error) {
            console.error("Authentication error:", error);
            setIsLoading(false);
            return;
          } finally {
            setIsAuthorizing(false);
          }
        } else {
          console.log("TelegramProvider: Valid session exists, skipping auth");
        }

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
        setIsTelegram(false);

        setIsAuthorizing(false);
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
        isAuthorizing,
        themeParams,
        theme,
        userId,
        isTelegram,
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
