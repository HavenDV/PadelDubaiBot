"use client";

import { WebApp } from "telegram-web-app";
import { useTelegramEvent, TelegramEventType, TelegramEventHandler } from "./useTelegramEvent";

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
 * Hook for handling multiple Telegram events at once
 * 
 * @param events - Array of event configurations
 * @param webApp - The Telegram WebApp instance (optional)
 * @param options - Global configuration options
 * 
 * @example
 * ```typescript
 * useTelegramEvents([
 *   { eventType: "themeChanged", handler: handleThemeChange },
 *   { eventType: "mainButtonClicked", handler: handleMainButton },
 *   { eventType: "backButtonClicked", handler: handleBackButton }
 * ]);
 * ```
 */
export function useTelegramEvents(
  events: Array<{
    eventType: TelegramEventType;
    handler: TelegramEventHandler;
  }>,
  webApp?: WebApp | null,
  options: UseTelegramEventOptions = {}
): void {
  // Register each event individually
  for (const { eventType, handler } of events) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramEvent(eventType, handler, webApp, options);
  }
}