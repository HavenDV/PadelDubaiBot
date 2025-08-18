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
 * Hook for clipboard text received events
 * Provides clipboard text in the callback when received from Telegram
 * 
 * @param handler - Function called when clipboard text is received
 * @param webApp - The Telegram WebApp instance (optional)
 * @param options - Configuration options
 * 
 * @example
 * ```typescript
 * useTelegramClipboardEvent((text) => {
 *   console.log('Clipboard text received:', text);
 *   setInputValue(text);
 * });
 * ```
 */
export function useTelegramClipboardEvent(
  handler: (text: string | null) => void,
  webApp?: WebApp | null,
  options: UseTelegramEventOptions = {}
): void {
  const { debug = false } = options;
  useEffect(() => {
    const telegramApp =
      webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    if (!telegramApp) return;

    const cb = (eventData: { data: string | null }) => {
      if (debug) console.log("useTelegramClipboardEvent: clipboardTextReceived", eventData);
      handler(eventData?.data ?? null);
    };

    telegramApp.onEvent("clipboardTextReceived", cb);
    return () => telegramApp.offEvent("clipboardTextReceived", cb);
  }, [handler, webApp, options, debug]);
}
