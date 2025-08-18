"use client";

import { useEffect, useRef } from "react";
import { WebApp, ThemeParams } from "telegram-web-app";

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
    const telegramApp = webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    
    if (!telegramApp) {
      if (debug) {
        console.log(`useTelegramEvent: No WebApp instance available for ${eventType}`);
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
  useTelegramEvent("themeChanged", () => {
    const telegramApp = webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    if (telegramApp) {
      handler({
        themeParams: telegramApp.themeParams || null,
        colorScheme: telegramApp.colorScheme || null
      });
    }
  }, webApp, options);
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
  useTelegramEvent("viewportChanged", () => {
    const telegramApp = webApp || (typeof window !== "undefined" ? window.Telegram?.WebApp : null);
    if (telegramApp) {
      handler({
        height: telegramApp.viewportHeight,
        is_state_stable: telegramApp.isVerticalSwipesEnabled,
        is_expanded: telegramApp.isExpanded
      });
    }
  }, webApp, options);
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