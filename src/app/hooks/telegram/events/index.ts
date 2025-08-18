/**
 * Telegram Mini App Events
 *
 * This module provides React hooks for handling Telegram Mini App events
 * in a declarative way with proper cleanup and type safety.
 */

// Export all event hooks and types
export * from "./useTelegramEvent";

// Re-export specific hooks for convenience
export { useTelegramEvents } from "./useTelegramEvents";
export { useTelegramEvent } from "./useTelegramEvent";
export { useTelegramThemeEvent } from "./useTelegramThemeEvent";
export { useTelegramClipboardEvent } from "./useTelegramClipboardEvent";
export { useTelegramViewportEvent } from "./useTelegramViewportEvent";

// Export types
export type {
  TelegramEventType,
  TelegramEventHandler,
} from "./useTelegramEvent";
