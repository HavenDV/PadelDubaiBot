"use client";

import { WebApp, ThemeParams } from "telegram-web-app";
import { useTelegramEvent } from "./useTelegramEvent";

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
  useTelegramEvent(
    "themeChanged",
    () => {
      const telegramApp =
        webApp ||
        (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
      if (telegramApp) {
        handler({
          themeParams: telegramApp.themeParams || null,
          colorScheme: telegramApp.colorScheme || null,
        });
      }
    },
    webApp,
    options
  );
}
