"use client";

import type { WebApp } from "telegram-web-app";
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
  const { debug = false } = options;
  useEffect(() => {
    const telegramApp =
      webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    if (!telegramApp) return;

    const cb = (eventData: { isStateStable: boolean }) => {
      if (debug) console.log("useTelegramViewportEvent: viewportChanged", eventData);
      handler({
        height: telegramApp.viewportHeight,
        is_state_stable: !!eventData?.isStateStable,
        is_expanded: telegramApp.isExpanded,
      });
    };

    telegramApp.onEvent("viewportChanged", cb);
    return () => telegramApp.offEvent("viewportChanged", cb);
  }, [handler, webApp, options, debug]);
}
