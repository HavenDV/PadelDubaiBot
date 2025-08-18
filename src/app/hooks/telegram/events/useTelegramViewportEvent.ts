"use client";

import { WebApp } from "telegram-web-app";
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
 * Hook for viewport change events
 * Provides viewport dimensions in the callback
 *
 * @param handler - Function called when viewport changes
 * @param webApp - The Telegram WebApp instance (optional)
 * @param options - Configuration options
 */
export function useTelegramViewportEvent(
  handler: (data: {
    height: number;
    is_state_stable: boolean;
    is_expanded: boolean;
  }) => void,
  webApp?: WebApp | null,
  options: UseTelegramEventOptions = {}
): void {
  useTelegramEvent(
    "viewportChanged",
    () => {
      const telegramApp =
        webApp ||
        (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
      if (telegramApp) {
        handler({
          height: telegramApp.viewportHeight,
          is_state_stable: telegramApp.isVerticalSwipesEnabled,
          is_expanded: telegramApp.isExpanded,
        });
      }
    },
    webApp,
    options
  );
}
