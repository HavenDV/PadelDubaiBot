"use client";

import { useEffect, useRef } from "react";
import { WebApp } from "telegram-web-app";

/**
 * Available Telegram Mini App events
 * Based on official Telegram WebApp API documentation
 */
export type TelegramEventType =
  | "themeChanged"
  | "viewportChanged"
  | "mainButtonClicked"
  | "backButtonClicked"
  | "settingsButtonClicked"
  | "invoiceClosed"
  | "popupClosed"
  | "qrTextReceived"
  | "clipboardTextReceived"
  | "writeAccessRequested"
  | "contactRequested"
  | "biometricManagerUpdated"
  | "biometricAuthRequested"
  | "biometricTokenUpdated";

/**
 * Event handler function type
 */
export type TelegramEventHandler = () => void;

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
 * Custom hook for handling Telegram Mini App events
 *
 * Provides a clean, declarative way to register and cleanup Telegram WebApp event handlers
 *
 * @param eventType - The Telegram event to listen for
 * @param handler - The function to call when the event occurs
 * @param webApp - The Telegram WebApp instance (optional, will use window.Telegram.WebApp if not provided)
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // Listen for theme changes
 * useTelegramEvent("themeChanged", () => {
 *   console.log("Theme changed!");
 * });
 *
 * // With debug logging
 * useTelegramEvent("mainButtonClicked", handleMainButton, webApp, {
 *   debug: true
 * });
 * ```
 */
export function useTelegramEvent(
  eventType: TelegramEventType,
  handler: TelegramEventHandler,
  webApp?: WebApp | null,
  options: UseTelegramEventOptions = {}
): void {
  const { debug = false } = options;

  // Use ref to store the current handler to avoid re-registering on every render
  const handlerRef = useRef<TelegramEventHandler>(handler);
  handlerRef.current = handler;

  useEffect(() => {
    // Get WebApp instance
    const telegramApp =
      webApp ||
      (typeof window !== "undefined" ? window.Telegram?.WebApp : null);

    if (!telegramApp) {
      if (debug) {
        console.log(
          `useTelegramEvent: No WebApp instance available for ${eventType}`
        );
      }
      return;
    }

    // Create wrapper handler that calls the current handler
    const eventHandler = () => {
      if (debug) {
        console.log(`useTelegramEvent: ${eventType} event fired`);
      }
      handlerRef.current();
    };

    // Register event handler
    if (debug) {
      console.log(`useTelegramEvent: Registering ${eventType} event handler`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (telegramApp as any).onEvent(eventType, eventHandler);

    // Cleanup function
    return () => {
      if (debug) {
        console.log(`useTelegramEvent: Cleaning up ${eventType} event handler`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (telegramApp as any).offEvent(eventType, eventHandler);
    };
  }, [eventType, webApp, debug]);
}
