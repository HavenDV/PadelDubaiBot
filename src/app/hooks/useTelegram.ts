"use client";

import { useState, useEffect } from "react";
import { WebApp, WebAppInitData } from "telegram-web-app";
import { setAuthToken, supabase } from "@lib/supabase/client";
import { exchangeTelegramAuthViaInitData } from "../lib/telegram/auth";

export interface TelegramHookResult {
  webApp: WebApp | null;
  isLoading: boolean;
  isAuthorizing: boolean;
  userId: number | null;
  isTelegram: boolean;
}

/**
 * Independent hook for Telegram WebApp functionality
 * 
 * Handles:
 * - WebApp detection and initialization
 * - Authentication with Supabase
 * - User ID extraction
 * - Loading state management
 * 
 * @returns TelegramHookResult with WebApp instance and state
 */
export function useTelegram(): TelegramHookResult {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  // Function to initialize Supabase with the token
  const initializeSupabase = (accessToken: string, refreshToken?: string) => {
    setAuthToken(accessToken, refreshToken);
    console.log(
      "useTelegram: set Authorization header with JWT",
      accessToken.substring(0, 10) + "…"
    );
  };

  // Function to check if we have a valid session
  const hasValidSession = async (): Promise<boolean> => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.log("useTelegram: No valid session found");
        return false;
      }

      console.log("useTelegram: Valid session exists");
      return true;
    } catch (error) {
      console.error("useTelegram: Error checking session:", error);
      return false;
    }
  };

  // Initialize Telegram WebApp on mount
  useEffect(() => {
    const initializeTelegram = async () => {
      setIsLoading(true);

      // Guard against server-side rendering
      const isBrowser = typeof window !== "undefined";

      // Check if we're actually running in Telegram
      if (isBrowser && window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Proper Telegram detection: check if we have actual Telegram context
        const isActuallyInTelegram = Boolean(
          (webApp.initData && webApp.initData.length > 0) ||
            webApp.initDataUnsafe?.user
        );

        setIsTelegram(isActuallyInTelegram);

        if (!isActuallyInTelegram) {
          // Not actually in Telegram, just web mode with script loaded
          setWebApp(null);
          setIsAuthorizing(false);
          setIsLoading(false);
          return;
        }

        // Only proceed with Telegram-specific initialization if actually in Telegram
        // Notify Telegram WebApp that we are ready
        window.Telegram.WebApp.ready();

        if (!webApp.initData) {
          setIsLoading(false);
          return;
        }

        // Check if we need to reauth by validating current session
        const needsReauth = !(await hasValidSession());

        if (needsReauth) {
          console.log("useTelegram: No valid session, authenticating...");

          try {
            setIsAuthorizing(true);
            const { access_token, refresh_token } =
              await exchangeTelegramAuthViaInitData(webApp.initData);

            // Set the token in Supabase client
            initializeSupabase(access_token, refresh_token);
          } catch (error) {
            console.error("useTelegram: Authentication error:", error);
            setIsLoading(false);
            return;
          } finally {
            setIsAuthorizing(false);
          }
        } else {
          console.log("useTelegram: Valid session exists, skipping auth");
        }

        setWebApp(webApp);

        // Parse init data from Telegram WebApp
        let initData: WebAppInitData = { auth_date: 0, hash: "" };
        try {
          initData = webApp.initDataUnsafe as WebAppInitData;
        } catch (error) {
          console.error("useTelegram: Error parsing initData:", error);
        }

        if (initData?.user) {
          const { id } = initData.user;
          setUserId(id);
        }

        setIsLoading(false);
      } else {
        // For server-side rendering or when Telegram WebApp isn't available
        console.log("useTelegram: Telegram WebApp not available");
        setWebApp(null);
        setIsTelegram(false);
        setIsAuthorizing(false);
        setIsLoading(false);
      }
    };

    initializeTelegram();
  }, []); // Empty dependency array - initialize once on mount

  return {
    webApp,
    isLoading,
    isAuthorizing,
    userId,
    isTelegram,
  };
}