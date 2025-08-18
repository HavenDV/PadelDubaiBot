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
  handler: (text: string) => void,
  webApp?: WebApp | null,
  options: UseTelegramEventOptions = {}
): void {
  useTelegramEvent("clipboardTextReceived", () => {
    const telegramApp = webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (telegramApp && (telegramApp as any).clipboardText) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clipboardText = (telegramApp as any).clipboardText;
      if (typeof clipboardText === 'string') {
        handler(clipboardText);
      }
    }
  }, webApp, options);
}