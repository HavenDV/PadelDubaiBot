"use client";

import type { WebApp, ThemeParams } from "telegram-web-app";
import { useEffect } from "react";

/**
 * Hook options for event registration
 */
interface UseTelegramEventOptions {
  /**
   * Debug logging for event registration/cleanup
   * @default false
   */
  debug?: boolean;
}

/**
 * Specialized hook for theme change events
 * Provides theme parameters and color scheme in the callback
 *
 * @param handler - Function called when theme changes, receives theme data
 * @param webApp - The Telegram WebApp instance (optional)
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * useTelegramThemeEvent(({ themeParams, colorScheme }) => {
 *   setAppTheme(themeParams);
 *   setColorScheme(colorScheme);
 * });
 * ```
 */
export function useTelegramThemeEvent(
  handler: (data: {
    themeParams: ThemeParams | null;
    colorScheme: "light" | "dark" | null;
  }) => void,
  webApp?: WebApp | null,
  options: UseTelegramEventOptions = {}
): void {
  const { debug = false } = options;
  useEffect(() => {
    const telegramApp =
      webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    if (!telegramApp) return;

    const cb = () => {
      if (debug) console.log("useTelegramThemeEvent: themeChanged");
      handler({
        themeParams: telegramApp.themeParams || null,
        colorScheme: telegramApp.colorScheme || null,
      });
    };

    telegramApp.onEvent("themeChanged", cb);

    return () => {
      telegramApp.offEvent("themeChanged", cb);
    };
  }, [handler, webApp, options, debug]);
}
