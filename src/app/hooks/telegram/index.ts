/**
 * Telegram Mini App Hooks
 * 
 * This module provides React hooks for Telegram Mini App functionality
 * including WebApp integration, theming, and clipboard operations.
 */

// Core Telegram hooks
export { useTelegram } from './useTelegram';
export { useTelegramTheme } from './useTelegramTheme';

// Event hooks (re-exported from events)
export * from './events';

// Export types
export type { TelegramHookResult } from './useTelegram';
export type { TelegramThemeResult } from './useTelegramTheme';
